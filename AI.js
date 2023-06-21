`<script>eval(`;
'strict';
'npm install';
'npm audit fix';
'node -e ';
// eval('
// if (print) { module = {"exports":{}} }
module.exports = class AI {
    /**
     * Built to be synchronous execution until unsupervised prompting is mastered.
     */
    compass = {
        goal:"",          // the end goal of what you want accomplished
        tasks: [],         // the tasks to be completed
        currentTask: {},   // the current task being worked on
        informationNeeded: "",
        nextTask: "",
        answerToLastPrompt: "",
    }
    // bots = [ // bot workers
    //     "GoalBot",
    //     "AutoTasker",
    //     "NicheBot",
    // ];
    ainodes = [];
    prompts = {
        everyprompt: {
            taskPlanner:        "write the universal tasks",
            aptModel:           "which ai model is the best to answer this prompt",
            taskexecution:      "complete the prompt",
            qualityCheck:       "",
            prompt:             "",// main action response
        },
        "generate-list-of-office-professions": "generate a list of office professions",
        "per-profession": {
            // "pre-prompt": "write a prompt",
            "description.txt": "write a short description for the profession: <profession>",
            "instructions.txt": "write instructions how to use the task: <task>",
            "tasks.txt": `
                for the profession <profession> write universal tasks.
                respond in this format.
                <list#>.<taskname>:<description>.            
            `, // recursively prompt this 
        },
        "per-task": {
            "level": "",
            "curr-task": "",
            "description": "",
            "pre-prompt": "",
            "instructions": "",
            "sub-tasks": "",
        }
    }
    essentialRoles = [
        "CEO",
        "Product Development",
        "Project Manager",
        "Software Development",  
        "Marketing",
        "Business Development",
        "Accounting",
        "IT Systems Administrator", 
        "Human Resources"
    ]

    phases = {
        service: [
            {
              "step": "Identify the service opportunity",
              "description": "Understand the market and customer needs to identify a service opportunity or gap."
            },
            {
              "step": "Research and gather information",
              "description": "Conduct market research, analyze competitors, and collect relevant data to gain insights and inform the service development."
            },
            {
              "step": "Define service goals and objectives",
              "description": "Set clear and specific goals and objectives that the service should achieve."
            },
            {
              "step": "Generate service ideas",
              "description": "Brainstorm and explore various service concepts and solutions to address the identified opportunity or gap."
            },
            {
              "step": "Evaluate and select the best service concept",
              "description": "Assess the generated service ideas based on feasibility, viability, and desirability. Choose the most promising service concept."
            },
            {
              "step": "Plan and design the service",
              "description": "Develop a detailed plan and design for the service, including its offerings, processes, and customer experience."
            },
            {
              "step": "Develop a service prototype",
              "description": "Create a prototype or mock-up of the service to test and validate its design and customer experience."
            },
            {
              "step": "Iterate and refine the service",
              "description": "Gather feedback from stakeholders and potential customers, make improvements, and iterate on the service concept and design."
            },
            {
              "step": "Finalize service details",
              "description": "Define the service features, pricing, delivery channels, and any additional components necessary for its successful implementation."
            },
            {
              "step": "Develop service infrastructure",
              "description": "Build the required infrastructure, systems, and resources to support the delivery of the service, such as technology platforms, human resources, and facilities."
            },
            {
              "step": "Train service staff",
              "description": "Provide training and development programs to equip the service staff with the necessary knowledge and skills to deliver the service effectively."
            },
            {
              "step": "Launch the service",
              "description": "Officially introduce the service to the market or target audience, making it available for use or purchase."
            },
            {
              "step": "Deliver the service",
              "description": "Provide the service to customers as per the defined offerings and customer experience, ensuring high-quality and consistent delivery."
            },
            {
              "step": "Monitor and evaluate performance",
              "description": "Track and measure key performance indicators (KPIs) to assess the service's effectiveness, customer satisfaction, and make data-driven improvements."
            },
            {
              "step": "Gather customer feedback",
              "description": "Collect feedback from customers to understand their experience, identify areas for improvement, and gather insights for enhancing the service."
            },
            {
              "step": "Iterate and enhance the service",
              "description": "Apply customer feedback and insights to continuously iterate on the service, enhance its offerings, improve customer experience, and address emerging needs."
            }
        ],
        product: [
            {
              "step": "Identify the Problem",
              "description": "Recognize a problem that needs a solution. This could come from user feedback, data analysis, market research, or direct observation."
            },
            {
              "step": "Define the Problem",
              "description": "Understand and articulate the problem clearly. This involves asking the right questions to explore the problem, its context, and its impact."
            },
            {
              "step": "Conduct Research",
              "description": "Research the problem in-depth to understand all its aspects. This may involve studying industry trends, existing solutions, user needs, and market gaps."
            },
            {
              "step": "Brainstorm Solutions",
              "description": "Come up with a wide range of possible solutions. Encourage creative thinking and aim to generate as many ideas as possible."
            },
            {
              "step": "Evaluate Solutions",
              "description": "Assess each potential solution based on feasibility, impact, and alignment with your business goals. This should help narrow down the list of possibilities."
            },
            {
              "step": "Prototype the Solution",
              "description": "Develop a prototype or a minimum viable product (MVP) for the chosen solution. This serves as an early model to test and validate your ideas."
            },
            {
              "step": "Test the Solution",
              "description": "Test your prototype or MVP with a small group of users. Gather feedback and observe how well the solution addresses the problem."
            },
            {
              "step": "Refine the Solution",
              "description": "Based on the feedback and testing results, refine and enhance the solution. Iterate on the design and functionality until it meets user needs effectively."
            },
            {
              "step": "Production and Implementation",
              "description": "Move the product from development to production. This involves finalizing the design, building out all features, and preparing the solution for launch."
            },
            {
              "step": "Product Launch",
              "description": "Launch the product in the market. This involves marketing activities to create awareness and strategies to achieve adoption."
            },
            {
              "step": "Post-Launch Evaluation",
              "description": "Monitor and evaluate the performance of the product post-launch. This includes tracking key metrics, gathering user feedback, and making necessary adjustments."
            },
            {
              "step": "Continuous Improvement",
              "description": "Based on the evaluation, continue to enhance the product, address issues, and add new features as necessary. This ensures that the product remains effective and competitive over time."
            }
          ]                    
    }
    methods = (function() {
        let _this = {};
        _this.Prompt = async function(service, prompt, model){
            const queryParams = new URLSearchParams({
                action:service, 
                model: model || "gpt-3.5-turbo",
            });
            const url = `/prompt?${queryParams}`;
            const data = {
                prompt,
                // apiKey,
            };
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                console.log('Response:', result);
                // Handle the response data here
                return result;
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle any errors that occurred during the request
            });
        };
        console.log('Running in Node.js');
        const { Configuration, OpenAIApi } = require("openai") // require("openai");
        console.log(Configuration)
        const configuration = new Configuration({
            // apiKey: process.env.OPENAI_API_KEY,
            // apiKey: "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"
            // apiKey: "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"
            // apiKey: "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"
            // apiKey: "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"
            apiKey: "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",
        });
        // console.error("ERROR: NEED TO MAKE IT SO CLIENT SUBMITS OPENAI_API_KEY");
        const openai = new OpenAIApi(configuration);
        _this.getModels = async function(){
            // const configuration = new Configuration({
            //     apiKey: process.env.OPENAI_API_KEY,
            // });
            const openai = new OpenAIApi(configuration);
            const response = await openai.listModels();
            return response;
        }
        _this.chat = async function({model, messages=[], prompt}) {
            const models = [
                "gpt-4",
                "gpt-4-0314",
                "gpt-4-32k",
                "gpt-4-32k-0314",
                "gpt-3.5-turbo",
            ];
            const completion = await openai.createChatCompletion({
                model: model,
                messages: [
                    // ...messages,
                    {role: "user", content: prompt}
                ]
            });
            return completion;          
        }
        _this.textCompletion = async function({model, prompt, max_tokens=2000, temperature=0.3}){
            const models = [
                "babbage",
                "text-babbage-001",
                "ada",
                "text-ada-001",
                "curie",
                "curie-instruct-ada",
                "text-curie-001",
                "davinci-instruct-beta",
                "davinci",
                "text-davinci-001",
                "text-davinci-002",
                "text-davinci-003",
            ]
            model = model || "text-davinci-003";
            // const max_tokens = 2048;        
            return openai.createCompletion({
                model,
                prompt,
                max_tokens,
                temperature,
            })
        }
        _this.createImage = async function({prompt, size, format}) {
            return openai.createImage({
                prompt,
                n: 1, // number of images to generate
                size, // "1024x1024",
                response_format: format, //"url", // can also be b64_json
                // user: ""
            });
        }
        _this.editImage = async function({prompt, size, n, editimage}){
            return openai.createImageEdit(
                fs.createReadStream(editimage),//fs.createReadStream("otter.png"), // image to edit required
                // fs.createReadStream("mask.png"),  // mask, not required
                prompt,
                n,
                size, // "1024x1024"
                "url", // can also be b64_json
                //user: ""
            );
        }
        _this.variationImage = async function({image, size, n}){
            return openai.createImageVariation(
                fs.createReadStream("otter.png"),
                n,
                size, //"1024x1024"
                "url", // can also be b64_json
                //user: ""
            );
        }
        _this.audioTranscription = async function({image,model, prompt, response_format, temperature,language}){
            return openai.createTranscription(
                fs.createReadStream(image),
                model, //"whisper-1",
                prompt,
                response_format, //  json, text, srt, verbose_json, or vtt.
                temperature,
                language,
            );
        }
       _this.getServices = function(){
            const services = [
                "chat",
                "textCompletion",
                "createImage",
                "editImage",
                "variationImage",
                "audioTranscription",
            ]
            return services
        };
        _this.getModels = function(){
            const models = {
                openaiModels: [
                    "babbage",
                    "davinci",
                    "text-davinci-001",
                    "ada",
                    "text-curie-001",
                    "text-ada-001",
                    "curie-instruct-beta",
                    "davinci-instruct-beta",
                    "text-babbage-001",
                    "curie",
                    "text-davinci-002",
                    "text-davinci-003",
                    "gpt-4",
                    "gpt-4-0314",
                    "gpt-4-32k",
                    "gpt-4-32k-0314",
                    "gpt-3.5-turbo",
                ],
                googleModels: [
                    'ChatGPT', 'LaMDA', 'PaLM', 'Bard', 'Codey'
                ],
                largeLanguageModels: [
                    'ChatGPT',
                    'LaMDA',
                    'PaLM',
                    'Bard',
                    'Codey',
                    'GPT-3',
                    'Turing NLG',
                    'Microsoft Turing',
                    'EleutherAI GPT-J',
                    'Hugging Face GPT-Neo',
                    'Bloom',
                    'Chinchilla',
                    'DeepMind Jurassic-1 Jumbo',
                    'Google Research BERT',
                    'Google Research RoBERTa',
                    'Google Research DistilBERT',
                    'Google Research Megatron-Turing NLG',
                    'Hugging Face BERT',
                    'Hugging Face RoBERTa',
                    'Hugging Face DistilBERT',
                    'Hugging Face Megatron-Turing NLG',
                    'EleutherAI Megatron-Turing NLG',
                    'EleutherAI Jurassic-1 Jumbo',
                    'Chinchilla-1 Jumbo',
                    'Bloom-1 Jumbo',
                    'Google Research Switch Transformer',
                    'Hugging Face Switch Transformer',
                    'EleutherAI Switch Transformer',
                  ]
            }
            return models.openaiModels;
        }
        return _this;
    })();
    executionenvironment(code){
        const { exec } = require('child_process');
        let language = "javascript";
        let filename = "taskprogram";        
        const commandMap = {
        java: (filename, code)          => `java -cp . '${filename}.java'`,
        python: (filename, code)        => `python -c '${code}'`,
        javascript: (filename, code)    => `node -e '${code}'`,
        c: (filename, code)             => `echo '${code}' | gcc -x c -o '${filename}' - && './${filename}'`,
        "c++": (filename, code)         => `echo '${code}' | g++ -x c++ -o '${filename}' - && './${filename}'`,
        "c#": (filename, code)          => `dotnet script -p '${filename}.csx'`,
        ruby: (filename, code)          => `ruby -e '${code}'`,
        php: (filename, code)           => `php -r '${code}'`,
        swift: (filename, code)         => `swift -e '${code}'`,
        go: (filename, code)            => `echo '${code}' | go run -`,
        bash: (filename, code)          => `bash -c '${code}'`,
        html: (filename, code)          => `echo '${code}' > '${filename}.html' && open -a 'Google Chrome' '${filename}.html'`,
        powershell: (filename, code)    => `powershell -Command '${code}'`
        };          
        const command = commandMap[language](filename, code);
        if (command) {
          exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing command: ${error.message}`);
              return;
            }
            console.log(`Command output:\n\n\n${stdout}`);
          })
        } else {
          console.log("Language not found in the list of popular programming languages.");
        }
    }
    // Function to handle user input
    catches = 0;
    constructor() {
        // this.ai = require("./AI")({});
        this.fs = require("fs");
        this.logcnt = 0;//this.fs.readdirSync("./assistants/generated/0.__logs__", "utf8").length;
        this.departmentL_str = this.fs.readFileSync("./departments.txt", "utf8");
        this.departmentL_computer_str = this.fs.readFileSync("./department-computer.txt", "utf8");

        //     "conversation": (messages) => {
        //         let str = `<conversation>`
        //         str += "\n";
        //         messages.forEach((message)=>{
        //             str += `
        //             <msg author="${message.author}">
        //             ${message.message}
        //             </msg>
        //             `;
        //             str += "\n";
        //         });
        //         str += `</conversation>`
        //     }
        // }
        this.onEnvironment();
    }
    // onBrowser = ["Prompt"];
    // onNodeJS = ["getModels","chat","textCompletion","editImage", "variationImage", "createImage"];
    env = "onBrowser";
    onEnvironment(){
        this.isBrowser = typeof window !== 'undefined';
        this.isNodeJS = typeof process !== 'undefined' && process.versions && process.versions.node && true;
        if      (this.isBrowser)this.onBrowser();
        else if (this.isNodeJS) this.onNodeJS();
        else                    throw new Error("Environment not supported");
    }
    onBrowser(){
        this.env = "browser";
        const answer = prompt("Run AI on (console | gui)?");
        if (answer === "console") {
            this.isConsole = true;
        } else if (answer === "gui") {
            this.isGUI === true;
        } else {
            throw new Error();
        }
    }
    onNodeJS(){
        this.env = "nodejs";
        const path = require('path');
        const fileName = path.basename(process.argv[1]);
        const service = process.argv[2];
        const model = process.argv[3];
        const exportedModule = require('./AI.js'); // Replace './mymodule' with the path to your module
        const moduleName = path.basename('AI.js');
        const sameModuleCalledAsMain = true;//exportedModule === moduleName;
        this.isShell = sameModuleCalledAsMain && service && model && true;
        this.isServer = sameModuleCalledAsMain && true;
        this.server();
        this.ui();
    }
    parse(){
        log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, "started program");
        this.departmentL = parseDepartment(this.departmentL_str);
        this.departmentL_computer = parseDepartment_computer(this.departmentL_computer_str);
    }
    populate(){
        this.iterate((department, profession)=>{
            // this.profession = profession;
            // if (index_department === 0 && index_profession === 0) {
                log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, `iterating profession ${profession}`);
                let foldername = profession.title;
                foldername = foldername.replace(/ /g, "-");
                let _this = {
                    profession,
                    department,
                    foldername
                }
                createDirectory(foldername);
                    initGit.bind(this)(foldername);
                    initNPM.bind(this)(_this, foldername, "1.0.0", "GPTRPA", "./index.js", "djtinkers365");
                    // createPrePrompt.bind(this)();
                    // createDescription.bind(this)(_this);
                    // createInstructions.bind(this)();
                    // createHighLevelTasks.bind(this)(_this);   // this happens recursively but not this version
                    createBundleJS.bind(this)(_this);
                    createREADME.bind(this)(_this);
                    createConfigAutomata.bind(this)(_this);
        });
        this.iterate((department, profession)=>{

            let delay = 1000

            this.profession = profession;
            // if (index_department === 0 && index_profession === 0) {
                log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, `iterating profession ${profession}`);
                let foldername = profession.title;
                foldername = foldername.replace(/ /g, "-");
                let _this = {
                    profession,
                    department,
                    foldername
                }
                // createDirectory(foldername);
                    // initGit.bind(this)(foldername);
                    // initNPM.bind(this)(_this, foldername, "1.0.0", "GPTRPA", "./index.js", "djtinkers365");
                    setTimeout(()=>{
                    // createPrePrompt.bind(this)();
                        createDescription.bind(this)(_this);
                        // createInstructions.bind(this)();
                        createHighLevelTasks.bind(this)(_this);   // this happens recursively but not this version
                    }, delay += 3500);
                    // createBundleJS.bind(this)(_this);
                    // createREADME.bind(this)(_this);
                    // createConfigAutomata.bind(this)(_this);
        });
    }
    iterate(cb){
        this.departmentL/*_computer*.filter(
            (department)=>{
                return ["Software Development", "Web Development"].includes(department.name)
            }
        )*/.forEach((department, index_department)=>{
            // this.department = department;
            if (department.name !== "") {
                log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, `iterating department ${department}`);
                department.professionL.forEach((profession, index_profession)=>{

                    cb(department, profession)
                });
            }
        });
    }
    promptrequest = () => {
        let obj = {
        immutableinstructins: () => `
            <immutable instructions>
                <onresponse>
                respond only in bash code. place all code in one block. echo each task.
                be sure the code is able to prompt gpt.
                </onresponse>
                <outputenvironment>
                html
                </outputenvironement>
                <permissions>
                if the ai don't know something and need to research, request internet access.
                if the ai need to save something, request file save access.
                if the ai need to read something, request file read access.
                if the ai need to write something, request file write access.
                if the ai need db access, request db access [read, write].
                if the ai need human intervention, request human intervention.
                if the ai need to reset, request reset.
                if the ai need to power down, request power down.
                </permissions>
                <onerror>
                if the ai errors, it must state the error.
                </onerror>
                <uponcompletion>
                if the list of tasks are complete or empty, then generate more tasks.
                ask me in bash what is my goal
                </uponcompletion>
            </immutable instructions>
        `,
        format: () => `
            <response format onsuccess>
                {
                    success:true,
                    permissions: [""],
                    ext,
                    coderesponse: [codePerPermission],
                    nexttaskselfprompt: "",
                    responseconfidence,
                    endgoal: "",
                    currenttask: "",
                    tasks: [""],
                    informationneeded: "",
                }
            </response format>
            <response format onerror>
                {
                    succes:false
                    error: "",
                }
            </response format>
        `,
        }
        context: () => `
            <context>

            </context>
        `
    };
    // prompt(prompt) {
    //     // this.ai.textCompletion({

    //     // })
    //     return this.ai.chat({
    //             model: "gpt-3.5-turbo",
    //             prompt,
    //     })
    // }

    prompter = ["morpheus", "a-z"];
    async onPrompt(response){
        let result = `
        achieve the prompts goal.
        respond only in javascript. 
        place all code in one block. 
        console.log each task. 
        ##prompt##
        \n 
        ` + response; //prompt; 
        // this.prompts = Object.keys(this.prompts.everyprompt);
        // let service = this.prompts.shift();
        const service = process.argv[2];
        const model = process.argv[3]; 
        const max_tokens = 2048;
        const temperature = 0.3;
        console.log('service', service);
        // console.log(this);
        await this.methods[service]({model, result, max_tokens, temperature})
        .then(this.onResponse)
        .catch(this.autoDebug.bind(this));
    }
    onResponse(response){
        this.onPrompt.bind(this)(response);
        console.log('AI:', response);
        this.executionenvironment(response);
    }
    autoDebug(error) {
        console.error('Error:', error);
        console.log("auto debug itself");
        if (this.catches < 3) this.catches++, this.onPrompt(String(error));
        else this.catches = 0;
    }
    morpheusPrompt(){ // advanced goal oriented self modifying prompting
        /*
            Thank you for providing more context. Based on your description, 
            it seems like you are envisioning a dynamic and adaptive prompting system, 
            inspired by the concept of shape shifting or self-modifying code, 
            where the initial prompt generates subsequent prompts that carry on and guide the next task or line of inquiry. 
            This "Morpheus prompting" would involve a prompt that 
            can evolve and adapt without explicitly keeping track of specific details or variables.

            In this hypothetical scenario, the initial prompt would be designed to generate prompts 
            that encapsulate relevant information and context, allowing the system to progress from 
            one task to another seamlessly. It could involve utilizing context embeddings, 
            memory-based mechanisms, or reinforcement learning techniques to carry forward relevant 
            information while discarding irrelevant details.
        */
        const prompt = `
        1) endgoal:
        2) currenttask: 
        3) informationneeded:
        4) nextTask:
        5) answerToLastPrompt:
        `;
    }
    initialPrompt(){
        /**
         * Starts at phase 1 Identify Problem
         */
    }
    taskerPrompt() {
        /**
         * Generates a list of tasks.
         * Will recursive dive into task making universal tasks if necessary.
         */
    }
    workflowPrompt(){
        /**
         * Receives list of tasks and organizes how 
         * these tasks will be coordinated between workers.
         * AI must provide the order to execute tasks in.
         */
    }
    taskPrompt(){
        /**
         * Gives ai the task
         */
    }
    netPrompt(){
        /**
         * 
         */
    }
    az_walkthrough(){
        try {
            let serviceOrProduct = prompt("Service or Product") || "service"
            let task = this.phases["service"].find((task)=>task.task === this.currentTask);
            // start prompt
            
            // if task to highlevel, then recursively divine into universal tasks
            // when task complete
            this.currentTask = newTask;
        } catch (e) {
            console.error(e);
        }
    }
    ui(){
        Just:if (this.isNodeJS && this.isShell)     this.ui_terminal();
        else if (this.isNodeJS && this.isImported)  this.ui_terminal();
        else if (this.isBrowser && this.isGUI)      this.ui_browser();
        else if (this.isBrowser && this.isConsole)  this.ui_console();
        else throw new Error("environment not supported");
    }
    ui_terminal(){
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log('Welcome to the AI Chat terminal!');
        console.log();
        console.log("tell me your goal");
        rl.setPrompt('You: ');
        rl.prompt();
        // Listen for user input
        rl.on('line', this.onPrompt.bind(this));
    }
    ui_console(){
        console.log('Welcome to the AI Chat console!');
        console.log();
        console.log("tell me your goal");
    }
    ui_browser(){
        this.render();
    }
    onSite(req, res, obj){
        const thiscode = require("fs").readFileSync("./AI.js","utf8");
        res.end(
            `
            <!DOCTYPE html>
            <html>
            <head>
              <title>ChatGPT Web Component</title>
              <style>
                /* Styles for the chat container */
                    #chat-container {
                    width: 100%;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f2f2f2;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    }
            
                    /* Styles for the chat messages */
                    #chat-messages {
                    margin-bottom: 20px;
                    height: 200px;
                    overflow-y: scroll;
                    padding: 10px;
                    background-color: #fff;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    }
            
                    /* Styles for the user input */
                    #user-input {
                    width: 100%;
                    margin-bottom: 10px;
                    padding: 5px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    }
            
                    /* Styles for the submit button */
                    #submit-btn {
                    display: block;
                    width: 100%;
                    padding: 8px;
                    background-color: #4caf50;
                    color: #fff;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                    }
            
                    /* Styles for chat messages */
                    #chat-messages div {
                    margin-bottom: 5px;
                    }
            
                    /* Customized styles for user and AI messages */
                    #chat-messages div:nth-child(odd) {
                    color: #0099ff; /* User message color */
                    }
            
                    #chat-messages div:nth-child(even) {
                    color: #ff9900; /* AI message color */
                    }
            
                    /* Styles for other API response */
                    #chat-messages div:last-child {
                    color: #555; /* Other API response color */
                    }
            
              </style>
            </head>
            <body>
              <div id="chat-container">
                <div id="chat-messages"></div>
                <textarea id="user-input" rows="10" maxlength="1000" placeholder="Command the AI"></textarea>
                <button id="submit-btn">Submit</button>
              </div>
            
              <script>
                // Add your JavaScript code here
                const chatContainer = document.getElementById('chat-container');
                const chatMessages = document.getElementById('chat-messages');
                const userInput = document.getElementById('user-input');
                const submitBtn = document.getElementById('submit-btn');
            
                // ChatGPT API configuration
                const chatGptApiEndpoint = 'YOUR_CHATGPT_API_ENDPOINT';
                const chatGptApiKey = 'YOUR_CHATGPT_API_KEY';
            
                // Other API configuration
                const otherApiEndpoint = 'OTHER_API_ENDPOINT';
                const otherApiKey = 'OTHER_API_KEY';
            
                // Function to send a message to ChatGPT API
                async function sendMessageToChatGpt(message) {
                  const response = await fetch(chatGptApiEndpoint, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + chatGptApiKey
                    },
                    body: JSON.stringify({
                      message: message
                    })
                  });
            
                  const data = await response.json();
                  return data.generated_code; // Modify this based on the response format from ChatGPT API
                }
            
                // Function to access another API
                async function accessOtherApi() {
                  const response = await fetch(otherApiEndpoint, {
                    headers: {
                      'Authorization': 'Bearer ' + otherApiKey
                    }
                  });
            
                  const data = await response.json();
                  return data; // Modify this based on the response format from the other API
                }
            
                // Function to display a message in the chat
                function displayMessage(message) {
                  const messageElement = document.createElement('div');
                  messageElement.textContent = message;
                  chatMessages.appendChild(messageElement);
                }
            
                // Event listener for submit button click
                submitBtn.addEventListener('click', async function() {
                  const userInputValue = userInput.value;
                  displayMessage('User: ' + userInputValue);
            
                  // Send user message to ChatGPT API
                  const generatedCode = await sendMessageToChatGpt(userInputValue);
                  displayMessage('AI: ' + generatedCode);
            
                  // Access another API
                  const otherApiResponse = await accessOtherApi();
                  displayMessage('Other API Response: ' + JSON.stringify(otherApiResponse));
            
                  // Clear user input
                  userInput.value = '';
                });

                // Function to adjust the row size of the user input textarea
                function adjustUserInputRows() {
                    const lines = userInput.value.split('\\n');
                    userInput.rows = Math.min(lines.length, 10);
                }
                // Event listener for user input changes
                userInput.addEventListener('input', adjustUserInputRows);
              </script>
            </body>
            </html>
            `
        );
    }
    router(z){
        return async (req, res) => {
            // this.currentTask
            let controllers = {
                "/": this.onSite.bind(this),
                "/prompt": this.onPrompt.bind(this)
            }
            if (!controllers.hasOwnProperty(req.url)) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Route not found.' }));
                return ;
            }
            if (req.method === 'GET' && req.url === '/') {
                console.log("onsite");
                this.onSite(req, res);
            } else if (req.method === 'POST' && req.url === '/your-route') {
                let requestBody = '';
                req.on('data', (chunk) => {
                    requestBody += chunk;
                });
                req.on('end', () => {
                try {
                    const { service, model, prompt } = JSON.parse(requestBody);
                    // Access the values of service, model, and prompt here
                    console.log('Service:', service);
                    console.log('Model:', model);
                    console.log('Prompt:', prompt);
                    // Do something with the data...
                    // this.onPrompt({service, model, prompt});
                    controller(req, res, {service, model, prompt})
                    const responseData = {
                        message: airesponse,
                    };
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    // res.end(JSON.stringify(responseData));
                    res.end(res.out);
                } catch (error) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Invalid request body.' }));
                }
                });
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Route not found.' }));
            }
        }
    }
    server(){
        const http = require('http');
        const server = http.createServer(this.router({}));
        server.listen(3000, () => {
            console.log('http://localhost:3000');
        });
    }
}

const ChainOfCommand = ["Executive", "Directors", "Manager", "Specialists"];

const Department = class Department {
    constructor(
        name,
        description,
        responsibilities,
        professionL,
    ){
        this.name = name;
        this.description = description;
        this.responsibilities = responsibilities;
        this.professionL = professionL;  
    }
}

const Profession = class Profession {
    constructor(
        department,
        title, 
        description,
        skills,
        responsibilities,
        tasks
    ) {
        this.department = department;
        this.title = title;
        this.description = description;
        this.responsibilities = responsibilities;
        this.tasks = tasks;
    }
}

const Task = class Task {
    constructor(
        level, 
        name, 
        description, 
        prompt, 
        tasks, 
        instructions, 
        gitlink, 
        javascript
    ){
        this.level = level; 
        this.name = name;
        this.description = description; 
        this.prompt = prompt;
        this.tasks = tasks;
        this.instructions = instructions;
        this.gitlink = gitlink;
        this.javascript = javascript;
    }
}


function parseDepartment(inputText) {
    const regex = /\d+\./g;
    const departments = inputText.split(regex).map(department => department.trim());
    const jsonArray = [];
    for (let i = 0; i < departments.length; i++) {
        const departmentText = departments[i];
        const lines = departmentText.split('\n');
        let department = '';
        const positions = [];
        for (let j = 0; j < lines.length; j++) {
        const line = lines[j].trim();
            if (line.endsWith('Department:')) {
                department = line.replace(':', '').replace(" Department", '').trim().replace(/\//g, '-');
            } else if (line.startsWith('-')) {
                positions.push(
                    new Profession(
                        // department,
                        department,
                        // title, 
                        line.replace('-', '').trim().replace(/\//g, '-'),
                        // description,
                        "",
                        // skills,
                        "",
                        // responsibilities,
                        "",
                        // tasks
                        []
                    )
                )
            }
        }
        const jsonObject = new Department(
            department,// name,
            "",// description,
            "",// responsibilities,
            positions,
        )    
        jsonArray.push(jsonObject);
    }
    console.log(jsonArray);
    return jsonArray;
}

function parseDepartment_computer(inputText) {
    return parseDepartment(inputText);
}

function createDirectory(profession){
    log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, `creating profession directory: ${profession}`);
    const fs = require('fs');
    // Specify the path and name of the directory you want to create
    const directoryPath = `./assistants/generated/${profession}`;
    try {
        // Use the fs.mkdirSync() function to create the directory synchronously
        fs.mkdirSync(directoryPath);
        log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, 'Directory created successfully!: ' + directoryPath);

    } catch (err) {
        console.error('An error occurred while creating the directory: ' + directoryPath, err);
        log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, 'An error occurred while creating the directory: ' + directoryPath, err);
    }
}

function initGit(name) {
    const { execSync } = require('child_process');
    try {
        log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, 'initing git');
        // Command to initialize a Git repository
        const initGitCommand = 'git init';
        // Execute the command synchronously
        execSync(initGitCommand, {cwd: `./assistants/generated/${name}`});
        console.log('Git repository initialized successfully!');
    } catch (error) {
        log(`./assistants/generated/0.__logs__/${this.logcnt}.txt`, 'An error occurred while initing git');
    }
}

function initNPM(_this, name, version, description, entryPoint, author) {
    log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, 'initing NPM: ' + `${name} ${version} ${description} ${entryPoint} ${author}`);
    const packageJson = {
        name: name,
        version: version,
        description: description,
        main: entryPoint,
        author: author
    };    
    const packageJsonContent = JSON.stringify(packageJson, null, 2);
    require("fs").writeFileSync(`./assistants/generated/${_this.foldername}/package.json`, packageJsonContent);
    console.log('package.json file created successfully!');
}

// fs.writeFileSync(
//     `./assistants/generated/${foldername}/${promptKey}.txt`, 
//     prompt(prompts["description"])
// );

// function createPrePrompt(){
//     log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, "create file: " + `./assistants/generated/${_this.foldername}/pre-prompt.txt`);
    
//     let prompt = this.prompts["per-profession"]["pre-prompt.txt"].replace("<task>", _this.task);
//     fs.writeFileSync(
//         `./assistants/generated/${this.foldername}/pre-prompt.txt`, 
//         prompt// this.prompt("")
//     );
// }

function createDescription(_this) {
    log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, "create file: " + `./assistants/generated/${_this.foldername}/description.txt`);
    const prompt = this.prompts["per-profession"]["description.txt"].replace("<profession>", _this.profession.title)
    console.log('prompt', prompt);
    this.prompt(prompt)
        .then((response)=>{
            const message = response.data.choices[0].message.content;
            console.log("ai response - createDescription: \n", message)
            require("fs").writeFileSync(
                `./assistants/generated/${_this.foldername}/description.txt`, 
                message
            );
        })
        .catch((error)=>{
            throw new Error(error);
        })
}
// function createInstructions(_this) {
//     log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, "create file: " + `./assistants/generated/${_this.foldername}/instructions.txt`);
//     require("fs").writeFileSync(
//         `./assistants/generated/${foldername}/instructions.txt`, 
//         this.prompt(
//             `
//                 ${this.prompts["per-profession"]["description.txt"].replace("<task>", task)}
//             `
//         )
//     );
// };
function createHighLevelTasks(_this){
    log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, "create file: " + `./assistants/generated/${_this.foldername}/tasks.txt`);

    let prompt = this.prompts["per-profession"]["tasks.txt"]
        .replace("<profession>", _this.profession.title)
        // .replace("<task>",      this.task);

    let tasks = this.prompt(prompt);

    this.prompt(prompt)
        .then((response)=>{
            const message = response.data.choices[0].message.content
            console.log("ai response - createHighLevelTasks: \n", message)
            require("fs").writeFileSync(
                `./assistants/generated/${_this.foldername}/tasks.txt`, 
                message
            );
        })
        .catch((error)=>{
            throw new Error(error);
        })

}

function createBundleJS(_this) {
    log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, "create file: " + `./assistants/generated/${_this.foldername}/bundle.js`);
    require("fs").writeFileSync(
        `./assistants/generated/${_this.foldername}/bundle.js`, 
        ""
    );
}
function createConfigAutomata(_this) {
    log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, "create file: " + `./assistants/generated/${_this.foldername}/config.automata.json`);
    require("fs").writeFileSync(
        `./assistants/generated/${_this.foldername}/config.automata.json`, 
        JSON.stringify(
            {
                "title": _this.profession.title,
                "$$cost": "0.00",
                "githubLink": `https://github.com/Neur0plasticity/${_this.foldername}.git`,
                "professions": [_this.profession.title],
                "department": _this.department.name,
                "videoLinks": ["https://www.youtube.com/watch?v=RtdSzXnz7cc"]
            }
        )
    );
}
function createREADME(_this){
    log(`./assistants/generated/0.__logs__/${this.logcnt++}.txt`, "create file: " + `./assistants/generated/${_this.foldername}/README.md`);
    require("fs").writeFileSync(
        `./assistants/generated/${_this.foldername}/README.md`, 
        ""
    );
}

function log(path, message){
    console.log(message);
    require("fs").writeFileSync(path, message);
}


// main();


// function main() {

//     let hive = new Hive();

//     hive.parse();
//     hive.populate();

// }





if (module) {
    console.log("returning the module AI.")
    const AI = require('./AI.js'); // Assuming the AI module is in a file named AI.js
    const ai = new AI({});
    // ai.ui();
}
`)</script>`;
