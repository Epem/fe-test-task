// (Number with star in the code indicates a section in the description.) (example: (1*))
// (1*). Validation: Ensure that all necessary validations are in place to check the incoming data, especially before accessing properties to avoid unexpected errors.
// (2*). Variable naming: Some variable names are not very descriptive (hash, resp, etc.). Use meaningful names that describe their purpose.
// (3*). Code Organization: Break down the large function into smaller, more manageable functions. This will improve readability, maintainability, and testability. For example make functions sendEmailsToDebtCollectors, generateRequestKey, prepareEmailConfig, sendSummaryEmail
// (4*). Code cleanup: Delete unnecessary comments, and unused constants
// (5*). Consistency in Logging: Logging seems to be implemented using different levels (logInfo, logDebug, logError, console.dir). It's good to ensure consistency in logging throughout the application for easier debugging. Use Template literals. 
// (6*). Code Readability and Maintainability: Avoid casts to type, and magic numbers;
// (7*). Error Handling: Error handling is a crucial aspect of any application. In the current code, there are instances where errors are caught but not necessarily handled properly. 
// (8*). Database Transactions: Depending on the database being used, transactions might be needed to ensure data consistency, especially when multiple updates are happening.
// (9*). Email Sending: Consider implementing a mechanism for sending emails if sending fails due to network issues or other reasons, and tracking bounces.
// (10*). Security: Ensure that sensitive information (like API keys) is handled securely, possibly through environment variables. Validate and sanitize input data to prevent injection attacks or unexpected behavior. Avoid hardcoding sensitive data like URLs, email templates, and API keys directly in the code. Use environment variables or configuration files instead.
app.post('/api/extract', upload.single('file'), async (req, res) => {
    // (5*)
    logInfo('POST /api/extract',req.body);
    logInfo('FILE=',req.file);
    ///(1*)
    if (req.body) {
        const file = req.file;
        const requestID = req.body.requestID;
        const project = req.body.project;
        const idUser = req.body.userID; //(2*)
        // (7*)
        const user = await User.findOne(idUser);

        if (requestID && project && idUser && user) {
            // (5*)
            logDebug('User with role '+user.role, user);
            if (user.role === 'ADVISOR' || user.role.indexOf('ADVISOR') > -1)
                return res.json({requestID, step: 999, status: 'DONE', message: 'Nothing to do for ADVISOR role'});
            
            /* reset status variables */
            await db.updateStatus(requestID, 1, ''); // (8*)

            logDebug('CONFIG:', config.projects);
            if (project === 'inkasso' && config.projects.hasOwnProperty(project) && file) {
                // (4*)
                const hashSum = crypto.createHash('sha256');
                const fileHash = idUser;
                const fileName = 'fullmakt';
                const fileType = mime.getExtension(file.mimetype);
                if (fileType !== 'pdf')
                    return res.status(500).json({requestID, message: 'Missing pdf file'});
                // (6*)
                await db.updateStatus(requestID, 3, ''); // (7*)

                const folder = `${project}-signed/${idUser}`;
                // (5*)
                logDebug('FILE2=', file);
                await uploadToGCSExact(folder, fileHash, fileName, fileType, file.mimetype, file.buffer);
                // (6*)
                await db.updateStatus(requestID, 4, ''); // (7*)
                const ret = await db.updateUploadedDocs(idUser, requestID, fileName, fileType, file.buffer);
                // (5*)
                logDebug('DB UPLOAD:', ret);
                // (6*)
                await db.updateStatus(requestID, 5, ''); // (8*)

                let sent = true;
                const debtCollectors = await db.getDebtCollectors(); // (7*)
                logDebug('debtCollectors=', debtCollectors);
                if (!debtCollectors)
                    return res.status(500).json({requestID, message: 'Failed to get debt collectors'});
                // (7*)
                if (!!(await db.hasUserRequestKey(idUser))) { //(4*)FIX: check age, not only if there's a request or not
                    // (6*)
                    return res.json({requestID, step: 999, status: 'DONE', message: 'Emails already sent'});
                }

                const sentStatus = {};
                // (3*)
                for (let i = 0; i < debtCollectors.length ; i++) {
                    // (6*)
                    await db.updateStatus(requestID, 10+i, ''); // (7*) // (8*)
                    //(3*)
                    const idCollector = debtCollectors[i].id;
                    const collectorName = debtCollectors[i].name;
                    const collectorEmail = debtCollectors[i].email;
                    const hashSum = crypto.createHash('sha256');
                    const hashInput = `${idUser}-${idCollector}-${(new Date()).toISOString()}`;
                    logDebug('hashInput=', hashInput);
                    hashSum.update(hashInput);
                    const requestKey = hashSum.digest('hex');
                    logDebug('REQUEST KEY:', requestKey);

                    const hash = Buffer.from(`${idUser}__${idCollector}`, 'utf8').toString('base64')
                    if (!!(await db.setUserRequestKey(requestKey, idUser))// (6*)(7*) // (8*)
                        && !!(await db.setUserCollectorRequestKey(requestKey, idUser, idCollector))) {// (6*)(7*) // (8*)
                        ///(3*)
                        /* prepare email */
                        const sendConfig = {
                            sender: config.projects[project].email.sender,
                            replyTo: config.projects[project].email.replyTo,
                            subject: 'Email subject',
                            templateId: config.projects[project].email.template.collector,
                            params: {
                                downloadUrl: `https://url.go/download?requestKey=${requestKey}&hash=${hash}`,
                                uploadUrl: `https://url.go/upload?requestKey=${requestKey}&hash=${hash}`,
                                confirmUrl: `https://url.go/confirm?requestKey=${requestKey}&hash=${hash}`
                            },
                            tags: ['request'],
                            to: [{ email: collectorEmail , name: collectorName }],
                        };
                        logDebug('Send config:', sendConfig);

                        try {
                            await db.setEmailLog({collectorEmail, idCollector, idUser, requestKey}) //(7*)
                        } catch (e) {
                            logDebug('extract() setEmailLog error=', e);
                        }

                        /* send email */
                        const resp = await email.send(sendConfig, config.projects[project].email.apiKey);
                        logDebug('extract() resp=', resp);

                        // update DB with result
                        await db.setUserCollectorRequestKeyRes(requestKey, idUser, idCollector, resp); //(7*)

                        if (!sentStatus[collectorName])
                            sentStatus[collectorName] = {};
                        sentStatus[collectorName][collectorEmail] = resp;

                        if (!resp) {
                            logError('extract() Sending email failed: ', resp);
                        }
                    }
                }
                // (6*)
                await db.updateStatus(requestID, 100, ''); //(7*)
                // (5*)
                logDebug('FINAL SENT STATUS:');
                console.dir(sentStatus, {depth: null}); // (5*)
                //(4*)
                //if (!allSent)
                //return res.status(500).json({requestID, message: 'Failed sending email'});

                await db.updateStatus(requestID, 500, ''); //(7*)
                //(3*)
                /* prepare summary email */
                const summaryConfig = {
                    //bcc: [{ email: 'unknown@domain.com', name: 'Tomas' }],
                    sender: config.projects[project].email.sender,
                    replyTo: config.projects[project].email.replyTo,
                    subject: 'Oppsummering Kravsforespørsel',
                    templateId: config.projects[project].email.template.summary,
                    params: {
                        collectors: sentStatus,
                    },
                    tags: ['summary'],
                    to: [{ email: 'unknown@otherdomain.no' , name: 'Tomas' }], // FIXXX: config.projects[project].email.sender
                };
                // (5*)
                logDebug('Summary config:', summaryConfig);
                //(4*)
                /* send email */
                //const respSummary = await email.send(sendConfig, config.projects[project].email.apiKey);
                //logDebug('extract() summary resp=', respSummary);
                // (6*)
                await db.updateStatus(requestID, 900, ''); //(7*)
            }
            // (6*)
            await db.updateStatus(requestID, 999, ''); //(7*)
            // (6*)
            return res.json({requestID, step: 999, status: 'DONE', message: 'Done sending emails...'});
        } else
            return res.status(500).json({requestID, message: 'Missing requried input (requestID, project, file)'});
    }
    res.status(500).json({requestID: '', message: 'Missing requried input (form data)'});
});
