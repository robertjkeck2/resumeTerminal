import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './Resume.css'

class Resume extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputText: '',
      commands: {},
      history: [],
      currentFolder: '',
      folders: ['Projects', 'About', 'Contact', 'Resume'],
      files: {
        '~': [],
        'Projects': ['KEX.git', 'AutoCaller.git', 'weatherAlertDjango.git', 'lykability.git', 'flaskResumeAPI.git'],
        'About': ['about.txt', 'website'],
        'Contact': ['email', 'linkedin'],
        'Resume': ['resume.pdf'],
      },
      prompt: '$ '
    }
    this.clearHistory = this.clearHistory.bind(this)
    this.setCurrentDirectory = this.setCurrentDirectory.bind(this)
    this.registerCommands = this.registerCommands.bind(this)
    this.listFiles = this.listFiles.bind(this)
    this.showWelcomeMsg = this.showWelcomeMsg.bind(this)
    this.catFile = this.catFile.bind(this)
    this.exitLink = this.exitLink.bind(this)
    this.openGitHub = this.openGitHub.bind(this)
    this.openLink = this.openLink.bind(this)
    this.showHelp = this.showHelp.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.clearInput = this.clearInput.bind(this)
    this.addHistory = this.addHistory.bind(this)
    this.focusDiv = this.focusDiv.bind(this)
  }

  clearHistory() {
    this.setState({ history: [] })
  }

  setCurrentDirectory(folder) {
    this.setState({ currentFolder: folder.trim()})
  }

  registerCommands() {
    this.setState({
      commands: {
        'clear' : this.clearHistory,
        'ls'    : this.listFiles,
        'help'  : this.showHelp,
        'cd'    : this.setCurrentDirectory,
        'cat'   : this.catFile,
        'github': this.openGitHub,
        'open'  : this.openLink,
        'exit'  : this.exitLink,
      }
    })
  }

  listFiles(arg) {
    if (arg === '~') {
      this.addHistory(this.state.folders.join(' '))
    } else {
      this.addHistory(this.state.files[arg].join(' '))
    }
  }

  showWelcomeMsg() {
    this.addHistory("John's Resume Terminal")
    this.addHistory("------------------------------------------------------------------------------")
    this.addHistory("Type `help` for available commands")
    this.addHistory("------------------------------------------------------------------------------")
  }

  exitLink() {
    var action = window.open('https://robertjohnkeck.com', '_self')
    return action
  }

  catFile(arg) {
    if (arg === "about.txt") {
      this.addHistory('ABOUT ME')
      this.addHistory("Strategy & Operations at DoorDash.\n\n" +
                      "MBA from Harvard Business School.\n\n" +
                      "BS Mechanical Engineering from Purdue.\n\n" +
                      "From Indianapolis, IN.")
    } else if (this.state.files[this.state.currentFolder].includes(arg)) {
      this.addHistory("-bash: cat: " +  arg + ": Not readable. Use 'open' to open this file.")
    } else if (this.state.folders.includes(arg)) {
      this.addHistory("-bash: cat: " +  arg + ": Argument is a directory not a file.")
    } else {
      this.addHistory("-bash: cat: " +  arg + ": No such file or directory")
    }
  }

  openGitHub(link) {
    var action = null
    var links = 'https://github.com/robertjkeck2/'
    var github_files = this.state.files['Projects']
    if (link === undefined) {
      action = window.open(links, '_blank')
    } else if (github_files.includes(link)) {
      links = 'https://github.com/robertjkeck2/' + link
      action = window.open(links, '_blank')
    } else {
      this.addHistory("-bash: github: " +  link + ": This is not a GitHub project file.")
    }
    return action
  }

  openLink(link) {
    var action = null
    const links = {
      'website': 'https://robertjohnkeck.com',
      'linkedin': 'https://www.linkedin.com/in/john-keck-644a3b29',
      'email': 'mailto:robertjkeck2@gmail.com',
      'resume.pdf': 'https://robertjohnkeck.com/resume.pdf?',
    }
    if (link === undefined) {
      this.addHistory("-bash: open: " + link + ": File argument missing.")
    } else if (Object.keys(links).includes(link)) {
      action = window.open(links[link], '_blank')
    } else {
      this.addHistory("-bash: open: " + link + ": Unable to open file.")
    }
    return action
  }

  showHelp() {
    this.addHistory("cd - change directory")
    this.addHistory("cat - read contents of .txt file")
    this.addHistory("clear - clear screen")
    this.addHistory("github - open a .git project in github")
    this.addHistory("help - print available commands")
    this.addHistory("open - open non-txt files")
    this.addHistory("ls - list files in directory")
    this.addHistory("exit - return to robertjohnkeck.com")
  }

  componentDidMount() {
    this.registerCommands()
    this.showWelcomeMsg()
    this.setCurrentDirectory('~')
  }

  componentDidUpdate() {
    this.focusDiv()
    var container = document.getElementById("main")
    container.scrollTop = container.scrollHeight
  }

  focusDiv() {
    ReactDOM.findDOMNode(this.refs.input).focus()
  }

  handleSubmit(e) {
    e.preventDefault()
    var input_text = this.state.inputText
    var input_array = input_text.split(' ')
    var input = input_array[0]
    var arg = input_array[1]
    var command = this.state.commands[input]
    this.addHistory("johnkeck:" + this.state.currentFolder + " " + this.state.prompt + " " + input_text)
    if (command === undefined) {
      if (input !== '') {
        this.addHistory("-bash: " + input + ": command not found")
      }
    } else if (command === this.listFiles) {
      command(this.state.currentFolder)
    } else if (command === this.setCurrentDirectory) {
      if (arg === "..") {
        this.setCurrentDirectory('~')
      } else if ((this.state.currentFolder === '~') && (this.state.folders.includes(arg))) {
        this.setCurrentDirectory(arg)
      } else if ((this.state.currentFolder !== '~') && (this.state.files[this.state.currentFolder].includes(arg)))  {
        this.addHistory("-bash: cd: " + arg + ": Not a directory")
      } else {
        this.addHistory("-bash: cd: " + arg + ": No such file or directory")
      }
    } else {
      command(arg)
    }
    this.clearInput()
  }

  handleInput(e) {
    this.setState({inputText: e.target.value})
  }

  handleClick(e) {
    this.focusDiv()
  }

  clearInput() {
    this.setState({inputText: ''})
  }

  addHistory(output) {
    var history = this.state.history
    history.push(output)
    this.setState({
      'history': history
    })
  }

  render() {
    var output = this.state.history.map(function(op, i) {
      return <p key={i}>{op}</p>
    })
    var printedPrompt = "johnkeck:" + this.state.currentFolder + " " + this.state.prompt
    return (
      <div className='resume-terminal' onClick={this.handleClick}>
        <div className='terminal'>
          <div className='bar'>
            <div className="bar-actions">
              <svg height="20" width="100" className="bar-svg">
                <circle cx="24" cy="14" r="5" fill="#bf616a" />
                <circle cx="44" cy="14" r="5" fill="#ebcb8b" />
                <circle cx="64" cy="14" r="5" fill="#a3be8c" />
              </svg>
              <p className="bar-text">1. bash</p>
            </div>
          </div>
          <div className="main" id="main">
            <div className="content">
              <div className="app">
                <div className='input-area'>
                  {output}
                  <form onSubmit={this.handleSubmit}>
                    <div className="prompt">
                      <p>
                        <label className="prompt">{printedPrompt}</label>
                        <input type="text" ref="input" autoFocus onChange={this.handleInput} value={this.state.inputText} />
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Resume
