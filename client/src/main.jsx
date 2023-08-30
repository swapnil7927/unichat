import ReactDOM from 'react-dom/client'
import StateProvider from "./context/StateContext";
import { initialState, reducer } from "./context/StateReducers.js";
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StateProvider initialState={initialState} reducer={reducer}>
    <App />
  </StateProvider>
)
