const chalk = require('chalk')
const ncp = require('ncp')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const inquirer = require('inquirer')
const { fileURLToPath } = require('url')

const Listr = require('listr')
const { projectInstall } = require('pkg-install')

const access = promisify(fs.access)
const copy = promisify(ncp)

const Template = require('../templates/Template')

async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, { clobber: false })
}
async function askTargetDirectory(){
    const answers = await inquirer.prompt({
        type: 'input',
        name: 'targetDirectory',
        message: 'Where do you want to create the project inside this directory?',
        default: 'IGDiscord-' + new Date().getUTCMilliseconds()
    })

    return {
        targetDirectory: answers.targetDirectory
    }
}

module.exports.createProject = async function createProject(options) {

    options = {
        ... options,
        targetDirectory: process.cwd()
    }
    

    if(options.name.toLowerCase() !== path.basename(process.cwd()).toLowerCase()) {
        if(fs.existsSync(options.targetDirectory + '/' + options.name)) {
            const target = await askTargetDirectory()

            fs.mkdirSync(options.targetDirectory + '/' + target.targetDirectory)
            options.targetDirectory = options.targetDirectory + '/' + target.targetDirectory
        } else {
            fs.mkdirSync(options.targetDirectory + '/' + options.name)
            options.targetDirectory = options.targetDirectory + '/' + options.name
        }
    } 

    const currentFileUrl = import.meta.url
    const templateDir = path.resolve(
        fileURLToPath(currentFileUrl),
        '../../templates',
        options.template.toLowerCase()
    )

    options.templateDirectory = templateDir;

    try {
        await access(templateDir, fs.constants.R_OK)
    } catch (err) {
        console.error('%s Invalid template name', chalk.red.bold('ERROR'))
        process.exit(1)
    }

    const tasks = new Listr([
        {
            title: 'Copying Project Files',
            task: () => copyTemplateFiles(options)
        },
        {
            title: 'Installing dependencies',
            task: () => projectInstall({ cwd: options.targetDirectory  }),
            enabled: () => options.npm
        }
    ])

    try {
        fs.createWriteStream(options.targetDirectory + '/package.json', { flags: 'a' }).write(Template.packageJson(options.name))
        await tasks.run()
        fs.createWriteStream(options.targetDirectory + '/.env', { flags: 'a' }).write(Template.envExample(options.token))
    } catch (err) {
        console.error(err, chalk.red.bold('ERROR'))
    }

    console.log('Project ready', chalk.green.bold('DONE'))
    return true
}

module.exports.createCommand = async function createCommand(options) {
    options = {
        ... options,
        targetDirectory: process.cwd() + '/commands/' + options.category
    }

    if(!fs.existsSync(options.targetDirectory)) {
        fs.mkdirSync(options.targetDirectory, { recursive: true })
    }
    
    try {
        await access(options.targetDirectory)
        .then(() => {
            fs.createWriteStream(options.targetDirectory + `/${options.name}.js`, { flags: 'a' })
                .write(Template.commandTemplate(options.name))
        })
        
    } catch (error) {
        console.error(error, chalk.red.bold('ERROR'))
        process.exit(1)
    }
}