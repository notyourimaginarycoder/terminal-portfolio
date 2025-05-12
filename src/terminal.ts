import { getCommandOutput } from './commands'

export class Terminal {
  private container: HTMLElement
  private output: HTMLElement
  private inputLine: HTMLDivElement
  private inputField: HTMLInputElement
  private history: string[] = []
  private historyIndex: number = -1
  private isMobile(): boolean {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  }

  constructor(container: HTMLElement) {
    this.container = container
    this.output = document.createElement('div')
    this.inputLine = document.createElement('div')
    this.inputField = document.createElement('input')
  }

  init() {
    this.container.classList.add('terminal')
    this.output.id = 'output'
    this.inputField.id = 'command'
    this.inputField.autofocus = true
    this.inputField.spellcheck = false

    this.inputLine.className = 'input-line'
    this.inputLine.innerHTML = `<span class="prompt">visitor@portfolio:~$</span>`
    this.inputLine.appendChild(this.inputField)

    this.container.appendChild(this.output)
    this.container.appendChild(this.inputLine)

    document.addEventListener('click', () => {
      this.inputField.focus()
    })

    this.inputField.addEventListener('blur', () => {
      if (!this.isMobile()) {
        this.inputField.focus()
      }
    })

    this.inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const input = this.inputField.value.trim()
        if (input) {
          this.history.push(input)
          this.historyIndex = this.history.length
        }
        this.executeCommand(input)
        this.inputField.value = ''
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--
          this.inputField.value = this.history[this.historyIndex]
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++
          this.inputField.value = this.history[this.historyIndex]
        } else {
          this.inputField.value = ''
        }
      }
    })

    this.printLine("type 'help' to see available commands.")
    this.inputField.focus()
  }

  private printLine(text: string) {
    const line = document.createElement('div')
    line.textContent = text
    this.output.appendChild(line)
    this.scrollToBottom()
  }

  private async typeText(text: string) {
    const line = document.createElement('div')
    this.output.appendChild(line)
    for (let i = 0; i < text.length; i++) {
      line.textContent += text[i]
      await new Promise((r) => setTimeout(r, 10))
    }
    this.scrollToBottom()
  }

  private executeCommand(cmd: string) {
    if (!cmd) return
    this.printLine(`visitor@portfolio:~$ ${cmd}`)
    const response = getCommandOutput(cmd)
    if (response === '__clear__') {
      this.output.innerHTML = ''
      return
    }
    this.typeText(response)
  }

  private scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight
  }
}
