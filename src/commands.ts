let currentPath = '/'
let commandHistory: string[] = []
const terminalVersion = '1.0.0'
const systemStartTime = new Date().getTime()
const aliases: Record<string, string> = {}
const randomNumber = Math.floor(Math.random() * 100) + 1
let attempts = 0

const fileSystem: Record<string, string[]> = {
  '/': ['about.txt', 'projects', 'contact.txt'],
  '/projects': ['portfolio.ts', 'terminal-portfolio.ts', 'stackdew-valley.js'],
  '/secret': ['hidden.txt'],
}

const commandMap: Record<string, { description: string; usage?: string[] }> = {
  about: {
    description: 'show a short bio.',
  },
  alias: {
    description: 'create or show command aliases.',
    usage: ['alias [name] [command]'],
  },
  cat: {
    description: 'display the contents of a file.',
    usage: ['cat [file]'],
  },
  cd: {
    description: 'change to a different directory.',
    usage: ['cd [folder]', 'cd ..'],
  },
  clear: {
    description: 'clear the terminal screen.',
  },
  contact: {
    description: 'display email and GitHub link.',
  },
  date: {
    description: 'show the current date and time.',
  },
  echo: {
    description: 'echo a message to the terminal.',
    usage: ['echo [message]'],
  },
  guess: {
    description: 'play a guess-the-number game.',
  },
  greet: {
    description: 'personalized greeting.',
  },
  help: {
    description: 'display all available commands.',
  },
  history: {
    description: 'show the command history.',
  },
  ls: {
    description: 'list files and folders in the current directory.',
    usage: ['ls', 'ls -l'],
  },
  mkdir: {
    description: 'create a new directory.',
    usage: ['mkdir [directory]'],
  },
  mv: {
    description: 'rename a file.',
    usage: ['mv [old_name] [new_name]'],
  },
  open: {
    description: 'open an external site.',
    usage: ['open github', 'open portfolio', 'open terminal-portfolio'],
  },
  ping: {
    description: 'ping a remote server.',
    usage: ['ping [host]'],
  },
  projects: {
    description: 'list featured personal projects.',
  },
  reboot: {
    description: 'reboot the system.',
  },
  reload: {
    description: 'reload the terminal window.',
  },
  rm: {
    description: 'remove a file.',
    usage: ['rm [file]'],
  },
  shutdown: {
    description: 'shut down the system.',
  },
  skills: {
    description: 'list programming languages and tools.',
    usage: ['languages', 'tools'],
  },
  sudo: {
    description: 'try it and see.',
  },
  uptime: {
    description: 'show the system uptime.',
  },
  version: {
    description: 'show the current terminal version.',
  },
  whoami: {
    description: 'display a fun user identity message.',
  },
}

const projectMetadata: Record<string, { title: string; description: string; link?: string }> = {
  'portfolio.ts': {
    title: 'portfolio (unfinished)',
    description: 'a basic portfolio - built with typescript',
    link: 'https://github.com/notyourimaginarycoder/portfolio',
  },
  'terminal-portfolio.ts': {
    title: 'terminal-portfolio',
    description: 'a terminal styled portfolio - built with typescript',
    link: 'https://github.com/notyourimaginarycoder/terminal-portfolio',
  },
  'stackdew-valley.js': {
    title: 'stackdew-valley',
    description: 'a 2d farming simulator with a twist - built with phaser',
    link: 'https://github.com/notyourimaginarycoder/stackdew-valley',
  },
}

export const getCommandOutput = (cmd: string): string => {
  const input = cmd.trim().toLowerCase()
  const [command, ...args] = input.split(' ')
  const arg = args.join(' ')

  commandHistory.push(input)
  if (commandHistory.length > 50) commandHistory.shift()

  if (args.includes('--help') || args.includes('-h')) {
    const meta = commandMap[command]
    if (meta) {
      let output = `'${command}' — ${meta.description}`
      if (meta.usage) {
        output += `\nUsage:\n  ${meta.usage.join('\n  ')}`
      }
      return output
    }
    return `'${command}' is not a recognized command`
  }

  switch (command) {
    case 'about':
      return 'i am the imaginary friend we all used to have at some point'

    case 'alias':
      if (args.length === 2) {
        aliases[args[0]] = args[1]
        return `alias '${args[0]}' created for command '${args[1]}'.`
      } else {
        return Object.keys(aliases)
          .map((alias) => `${alias}: ${aliases[alias]}`)
          .join('\n')
      }

    case 'cat':
      if (arg === 'about.txt')
        return 'this is my terminal-based portfolio - created with css, html, typescript'
      if (arg === 'contact.txt') return 'contact me via email or github'
      if (arg === 'hidden.txt') return 'nice! you found my hidden text file'
      return 'file not found'

    case 'cd':
      const target = `/${arg}`
      if (fileSystem[target]) {
        currentPath = target
        return `changed directory to ${currentPath}`
      }
      return 'directory not found'

    case 'clear':
      return '__clear__'

    case 'contact':
      return 'github: https://github.com/notyourimaginarycoder'

    case 'date':
      return new Date().toString().toLowerCase()

    case 'echo':
      return arg || 'no message to echo'

    case 'guess':
      if (args.length === 1) {
        const userGuess = parseInt(args[0])
        attempts++
        if (userGuess === randomNumber) {
          return `you guessed it! the number was ${randomNumber}. attempts: ${attempts}`
        } else if (userGuess < randomNumber) {
          return `too low! try again`
        } else {
          return `too high! try again`
        }
      }
      return 'Guess a number between 1 and 100.'

    case 'greet':
      const hour = new Date().getHours()
      const greeting =
        hour < 12
          ? 'good morning'
          : hour < 18
          ? 'good afternoon'
          : 'good evening'
      return `${greeting}, welcome to the terminal!`

    case 'help':
      return (
        `available commands (use --help or -h for more details):\n` +
        Object.keys(commandMap)
          .sort()
          .map((cmd) => `  - ${cmd}`)
          .join('\n')
      )

    case 'history':
      return commandHistory.join('\n')

    case 'ls':
      return fileSystem[currentPath]?.join('  ') || 'directory is empty'

    case 'mkdir':
      if (arg) {
        const targetPath = `/${arg}`
        if (!fileSystem[targetPath]) {
          fileSystem[targetPath] = []
          return `directory '${arg}' created`
        }
        return `directory '${arg}' already exists`
      }
      return 'please provide a directory name'

    case 'mv':
      if (args.length === 2 && fileSystem[currentPath]?.includes(args[0])) {
        const oldName = args[0]
        const newName = args[1]
        fileSystem[currentPath] = fileSystem[currentPath].map((f) =>
          f === oldName ? newName : f
        )
        return `renamed '${oldName}' to '${newName}'`
      }
      return 'invalid arguments or file not found'

    case 'open':
      if (arg === 'github') {
        window.open('https://github.com/notyourimaginarycoder', '_blank')
        return 'opening github...'
      }
      if (arg === 'portfolio') {
        window.open(
          'https://github.com/notyourimaginarycoder/portfolio',
          '_blank'
        )
        return 'opening source code for portfolio...'
      }
      if (arg === 'terminal-portfolio') {
        window.open(
          'https://github.com/notyourimaginarycoder/terminal-portfolio',
          '_blank'
        )
        return 'opening source code for terminal-portfolio...'
      }
      if (arg === 'stackdew-valley') {
        window.open(
          'https://github.com/notyourimaginarycoder/stackdew-valley',
          '_blank'
        )
        return 'opening source code for stackdew-valley...'
      }
      return 'unknown target - try open --help or -h'

    case 'ping':
      if (arg) {
        return `Pinging ${arg}... Response time: 50ms`
      }
      return 'Please provide a host to ping.'

    case 'projects':
      const files = fileSystem['/projects']
      if (!files || files.length === 0) return 'no projects found'

      return files
        .map((file, index) => {
          const meta = projectMetadata[file]
          if (meta) {
            return `${index + 1}. ${meta.title}\n   ${meta.description}${
              meta.link ? `\n   → ${meta.link}` : ''
            }`
          } else {
            return `${index + 1}. ${file.replace(/\.(ts|js|py|txt)$/, '')}`
          }
        })
        .join('\n\n')

    case 'reboot':
      return 'rebooting system... terminal will reload shortly'

    case 'reload':
      return 'reloading terminal...'

    case 'rm':
      if (arg && fileSystem[currentPath]?.includes(arg)) {
        fileSystem[currentPath] = fileSystem[currentPath].filter(
          (f) => f !== arg
        )
        return `file '${arg}' removed`
      }
      return `'${arg}' not found in current directory`

    case 'shutdown':
      return 'shutting down system...'

    case 'skills':
      if (arg === 'languages') {
        return `\t├─ general purpose\t\t: c#, java, javascript, python, typescript
        ├─ querying\t\t\t: sql
        ├─ scripting\t\t\t: autohotkey, bash
        ├─ systems programming\t\t: assembly, c, c++
        └─ web development\t\t: css, html`
      }
      if (arg === 'tools') {
        return `\t├─ databases\t\t\t: firebase, mysql workbench, postgresql
        ├─ devops & cloud\t\t: github actions, netlify, vercel
        ├─ frontend frameworks\t\t: react, vite
        ├─ ides & editors\t\t: visual studio, visual studio code
        ├─ testing\t\t\t: jest, supertest
        └─ version control\t\t: git, github`
      }
      return 'unknown target - try skills --help or -h'

    case 'sudo':
      return 'nice! but wrong terminal'

    case 'uptime':
      const uptime = (new Date().getTime() - systemStartTime) / 1000
      return `system uptime: ${Math.floor(uptime)} seconds`

    case 'version':
      return `terminal version: ${terminalVersion}`

    case 'whoami':
      return 'visitor'

    default:
      return `'${input}' is not a recognized command. type 'help' to see available ones`
  }
}
