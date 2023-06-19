module.exports = function AI(z){
// List models
// GET
// https://api.openai.com/v1/models
// Lists the currently available models, and provides basic information about each one such as the owner and availability.
    
    const isBrowser = typeof window !== 'undefined';
    const isNodejs = typeof process !== 'undefined' && process.versions && process.versions.node;

    if (isBrowser) {
        console.log('Running in the browser');
        this.Prompt = async function(service, prompt, model){
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
    } else if (isNodejs) {
        console.log('Running in Node.js');
        const { Configuration, OpenAIApi } = z["openai"] || require("openai") // require("openai");
        console.log(Configuration)
        const configuration = new Configuration({
            // apiKey: process.env.OPENAI_API_KEY,
            // apiKey: "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"
            // apiKey: "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"
            // apiKey: "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"
            apiKey: "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"
        });
        // console.error("ERROR: NEED TO MAKE IT SO CLIENT SUBMITS OPENAI_API_KEY");
        const openai = new OpenAIApi(configuration);
        this.getModels = async function(){
            // const configuration = new Configuration({
            //     apiKey: process.env.OPENAI_API_KEY,
            // });
            const openai = new OpenAIApi(configuration);
            const response = await openai.listModels();
            return response;
        }
        this.chat = async function({model, prompt}) {
            const models = [
                "gpt-4",
                "gpt-4-0314",
                "gpt-4-32k",
                "gpt-4-32k-0314",
                "gpt-3.5-turbo",
            ]
            const completion = await openai.createChatCompletion({
                model: model,
                messages: [{role: "user", content: prompt}],
            });
            return completion;          
        }
        this.textCompletion = async function({model, prompt, max_tokens=2000, temperature=0.3}){
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
    
        this.createImage = async function({prompt, size, format}) {
            return openai.createImage({
                prompt,
                n: 1, // number of images to generate
                size, // "1024x1024",
                response_format: format, //"url", // can also be b64_json
                // user: ""
            });
        }
        this.editImage = async function({prompt, size, n, editimage}){
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
        this.variationImage = async function({image, size, n}){
            return openai.createImageVariation(
                fs.createReadStream("otter.png"),
                n,
                size, //"1024x1024"
                "url", // can also be b64_json
                //user: ""
            );
        }
    
        this.audioTranscription = async function({image,model, prompt, response_format, temperature,language}){
            return openai.createTranscription(
                fs.createReadStream(image),
                model, //"whisper-1",
                prompt,
                response_format, //  json, text, srt, verbose_json, or vtt.
                temperature,
                language,
            );
        }
    } else {
        console.log('Unknown environment');
    }

    this.getServices = function(){
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
    this.getModels = function(){
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

    return this;
}
console.log("returning the module AI.")

const path = require('path');
// Get the name of the file initially called by the terminal
const fileName = path.basename(process.argv[1]);

const service = process.argv[2];

const model = process.argv[3];

// Get the exported module
const exportedModule = require('./AI.js'); // Replace './mymodule' with the path to your module
// Get the name of the exported module
const moduleName = path.basename('AI.js');
// Compare the file name with the module name
if (fileName === moduleName) {
    console.log('The current file matches the exported module:', moduleName);
//   let ai = new AI({});
//   const service = process.argv[2]
//   const 
//   ai.hasOwnProperty(service)
    const readline = require('readline');
    const AI = require('./AI'); // Assuming the AI module is in a file named AI.js

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Set up AI module
    const ai = new AI({});

    // Function to send a message to the AI module
    async function sendMessage(message) {
        const response = await ai[service]({
            model: model || "gpt-3.5-turbo",
            prompt: message
        });
        // console.log('response', response);
        return response.data.choices[0].message.content;
    }

    function executionenvironment(code){
        const { exec } = require('child_process');

        let language = "javascript";
        let filename = "taskprogram";
        
        const commandMap = {
        java: (filename, code) => `java -cp . '${filename}.java'`,
        python: (filename, code) => `python -c '${code}'`,
        javascript: (filename, code) => `node -e '${code}'`,
        c: (filename, code) => `echo '${code}' | gcc -x c -o '${filename}' - && './${filename}'`,
        "c++": (filename, code) => `echo '${code}' | g++ -x c++ -o '${filename}' - && './${filename}'`,
        "c#": (filename, code) => `dotnet script -p '${filename}.csx'`,
        ruby: (filename, code) => `ruby -e '${code}'`,
        php: (filename, code) => `php -r '${code}'`,
        swift: (filename, code) => `swift -e '${code}'`,
        go: (filename, code) => `echo '${code}' | go run -`,
        bash: (filename, code) => `bash -c '${code}'`,
        html: (filename, code) => `echo '${code}' > '${filename}.html' && open -a 'Google Chrome' '${filename}.html'`,
        powershell: (filename, code) => `powershell -Command '${code}'`
        };          
        const command = commandMap[language](filename, code);
        
        if (command) {
          exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing command: ${error.message}`);
              return;
            }
            console.log(`Command output:\n\n\n${stdout}`);
          });
        } else {
          console.log("Language not found in the list of popular programming languages.");
        }
    }

    // Function to handle user input
    function handleInput(input) {
        input = `respond only in javascript. place all code in one block. console.log each task. \n` + input;
        sendMessage(input)
            .then(response => {
                console.log('AI:', response);
                // parse
                // permissions
                // 
                // console.log("\n\n are you okay with the response being fed into the executor?")

                
                executionenvironment(response);

                // if error, auto debug

                // eval(response);
                // rl.prompt();
            })
            .catch(error => {
                console.error('Error:', error);
                rl.prompt();
            });
    }
    // Start the conversation
    console.log('Welcome to the AI Chat terminal!');
    console.log();
    console.log("tell me your goal");
    rl.setPrompt('You: ');
    rl.prompt();
    // Listen for user input
    rl.on('line', handleInput);
} else {
  console.log('The current file does not match the exported module:', moduleName);
}
