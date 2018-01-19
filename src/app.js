var React = require('react');

var App = React.createClass({
  getInitialState: function() {
      return {
        commands: {},
        history: [],
        currentFolder: '',
        folders: ['Projects', 'About', 'Contact', 'Resume'],
        files: {
          'Projects': ['AutoCaller', 'weatherAlertDjango', 'lykability', 'flaskResumeAPI'],
          'About': ['about.txt', 'website'],
          'Contact': ['email', 'linkedin'],
          'Resume': ['resume.pdf'],
        },
        prompt: '$ ',
      }
  },
  clearHistory: function() {
      this.setState({ history: [] });
  },
  setCurrentDirectory: function(folder) {
      this.setState({ currentFolder: folder.trim()});
  },
  registerCommands: function() {
    this.setState({
      commands: {
        'clear' : this.clearHistory,
        'ls'    : this.listFiles,
        'help'  : this.showHelp,
        'cd'    : this.setCurrentDirectory,
        'cat'   : this.catFile,
        'github': this.openGitHub,
        'open'  : this.openLink,
      }
    });
  },
  listFiles: function(arg) {
      if (arg === '~') {
          this.addHistory(this.state.folders.join(' '));
      } else {
          this.addHistory(this.state.files[arg].join(' '));
      }  
  },
  showWelcomeMsg: function() {
      this.addHistory("Type `help` for available commands");
      this.addHistory(" ");
  },
  catFile: function(arg) {
      if (arg === "about.txt") {
          this.addHistory('ABOUT ME');
          this.addHistory("Strategy & Operations at DoorDash.\n\n" +
                          "MBA from Harvard Business School.\n\n" +
                          "BS Mechanical Engineering from Purdue.\n\n" +
                          "From Indianapolis, IN.");
      } else if (this.state.files[this.state.currentFolder].includes(arg)) {
          this.addHistory("-bash: cat: " +  arg + ": Not readable. Use 'open' to open this file.");
      } else {
          this.addHistory("-bash: cat: " +  arg + ": No such file or directory");
      }
  },
  openGitHub: function(link) {
      var action = null;
      var links = 'https://github.com/robertjkeck2/';
      var github_files = this.state.files['Projects'];
      if (link === undefined) {
          action = window.open(links, '_blank');
      } else if (github_files.includes(link)) {
          links = 'https://github.com/robertjkeck2/' + link;
          action = window.open(links, '_blank');
      } else {
          this.addHistory("-bash: github: " +  link + ": This is not a GitHub project file.");
      }
      return action;
  },
  openLink: function(link) {
      var action = null;
      const links = {
          'website': 'https://robertjohnkeck.com',
          'linkedin': 'https://www.linkedin.com/in/john-keck-644a3b29',
          'email': 'mailto:robertjkeck2@gmail.com',
          'resume.pdf': 'https://robertjohnkeck.com/resume.pdf?',
      };
      if (link === undefined) {
          this.addHistory("-bash: open: " + link + ": File argument missing.");
      } else if (Object.keys(links).includes(link)) {
          action = window.open(links[link], '_blank');
      } else {
          this.addHistory("-bash: open: " + link + ": Unable to open file.");
      }
      return action;
  },
  showHelp: function() {
      this.addHistory("cd - change directory");
      this.addHistory("cat - read contents of .txt file");
      this.addHistory("clear - clear screen");
      this.addHistory("github - open a .git project in github");
      this.addHistory("help - print available commands");
      this.addHistory("open - open non-txt files");
      this.addHistory("ls - list files in directory");
  },
  componentDidMount: function() {
      var term = this.refs.term.getDOMNode();
      this.registerCommands();
      this.showWelcomeMsg();
      this.setCurrentDirectory('~');
      term.focus();
  },
  componentDidUpdate: function() {
      var el = React.findDOMNode(this);
      var container = document.getElementById("main");
      container.scrollTop = el.scrollHeight;
  },
  handleInput: function(e) {
      if (e.key === "Enter") {
          var input_text = this.refs.term.getDOMNode().value;
          var input_array = input_text.split(' ');
          var input = input_array[0];
          var arg = input_array[1];
          var command = this.state.commands[input];
          this.addHistory("johnkeck:" + this.state.currentFolder + " " + this.state.prompt + " " + input_text);
          if (command === undefined) {
              this.addHistory("-bash: " + input + ": command not found");
          } else if (command === this.listFiles) {
              command(this.state.currentFolder);
          } else if (command === this.setCurrentDirectory) {
              if (arg === "..") {
                  this.setCurrentDirectory('~');
              } else if (this.state.folders.includes(arg)) {
                  this.setCurrentDirectory(arg);
              } else if ((this.state.currentFolder != '~') && (this.state.files[this.state.currentFolder].includes(arg)))  {
                  this.addHistory("-bash: cd: " + arg + ": Not a directory");
              } else {
                  this.addHistory("-bash: cd: " + arg + ": No such file or directory");
              }
          } else {
              command(arg);
          }
          this.clearInput();
      }
  },
  clearInput: function() {
      this.refs.term.getDOMNode().value = "";
  },
  addHistory: function(output) {
    var history = this.state.history;
    history.push(output)
    this.setState({
      'history': history
    });
  },
  handleClick: function() {
    var term = this.refs.term.getDOMNode();
    term.focus();
  },
  render: function() {
      var output = this.state.history.map(function(op, i) {
          return <p key={i}>{op}</p>
      });
      var printedPrompt = "johnkeck:" + this.state.currentFolder + " " + this.state.prompt;
      return (
        <div className='input-area' onClick={this.handleClick}>
          {output}
          <p>
            <div className="prompt">
            <label className="prompt">{printedPrompt}</label>
            <input type="text" onKeyPress={this.handleInput} ref="term" />
            </div>
          </p>
        </div>
      )
  }
});

// render
var AppComponent = React.createFactory(App);
React.render(AppComponent(), document.getElementById('app'));
