import styles from './index.module.css';


const props = new WeakMap();


export default class ToggleSwitch {

    get label() {
        return props.get(this).label;
    }

    constructor({
        label = '',
    } = {}) {
        props.set(this, {
            label,
        });
    }

    render() {
        const container = document.createElement('template');

        container.innerHTML = `
    <span data-testid="sprintplus-toggle" class="${styles.toggle}">
        <input type="checkbox" id="sprintplus-toggle-input" class="${styles.input}">
        <label for="sprintplus-toggle-input" class="${styles.label}">
            <span aria-hidden="true" class="${styles.facade}"></span>
            <span class="${styles.text}">${this.label}</span>
        </label>
    </span>
`;

        return container.content;
    }
}
