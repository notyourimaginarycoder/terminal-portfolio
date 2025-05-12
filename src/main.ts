import './style.css'
import { Terminal } from './terminal'

const app = document.getElementById('app')

if (app) {
  const terminal = new Terminal(app)
  terminal.init()
}
