const inquirer = require('inquirer')
const path = require("path")
const mainFile = require('./main')

async function getOptions() {
    let questions = []

    questions.push({
        type: 'list',
        name: 'template',
        message: 'Choose which language to be used in creating the bot:',
        choices: ['JavaScript', 'TypeScript'],
        default: 'JavaScript'
    })

    questions.push({
        type: 'input',
        name: 'projectName',
        message: 'What will be the project name?',
        default: path.basename(process.cwd()).toLowerCase()
    })
    questions.push({
        type: 'input',
        name: 'token',
        message: 'Enter your discord bot token',
        default: 'ENTER_YOUR_TOKEN_HERE'
    })
    questions.push({
        type: 'confirm',
        name: 'npm',
        message: 'Do you want to automatically install dependencies using npm?',
        default: true
    })

    const answers = await inquirer.prompt(questions)
    return {  
        template: answers.template,
        name: answers.projectName,
        token: answers.token,
        npm: answers.npm
    }
}

async function missingTask() {
    let question = []
    question.push({
        type: 'list',
        name: 'task',
        message: 'Do you want to create a new project or create a new commands?',
        choices: ['New Project', 'New Command'],
        default: 'New Project'
    })

    const answers = await inquirer.prompt(question)

    return {
        task: answers.task
    }
}

async function getCommandInfo() {
    let questions = []
    questions.push({
        type: 'input',
        name: 'commandName',
        message: 'What will be the command name?',
        default: 'command'
    })
    questions.push({
        type: 'list',
        name: 'category',
        message: 'What will be the category of the command?',
        choices: ['General','Admin', 'Fun', 'Moderation', 'Utility', 'Music', 'Owner', 'Economy', 'Images', 'NSFW'],
        default: 'General'
    })

    const answers = await inquirer.prompt(questions)
    return {
        name: answers.commandName,
        category: answers.category
    }

}

module.exports.cli = async function cli(args) {
    await missingTask().then(async answers => {
        if (answers.task === 'New Project') {
            let options = await getOptions()
            if(options.template === 'TypeScript'){
                console.log('Sorry, TypeScript is not supported yet.')
                process.exit(1)
            }
            mainFile.createProject(options)
        } else if(answers.task === 'New Command') {
            let options = await getCommandInfo()
            mainFile.createCommand(options)
        }
    })
}