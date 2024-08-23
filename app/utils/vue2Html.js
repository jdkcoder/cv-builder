import { createApp } from 'vue'

export default (component, props = {}) => {
  const app = createApp(component, props);
  const div = document.createElement('div');
  app.mount(div);
  return div.innerHTML;
}