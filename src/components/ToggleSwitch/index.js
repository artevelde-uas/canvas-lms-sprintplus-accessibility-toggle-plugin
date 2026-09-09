import styles from './index.module.css';


const states = new WeakMap();


export default class ToggleSwitch {

    get checked() {
        const state = states.get(this);

        return state.checked;
    }
    set checked(value) {
        const state = states.get(this);

        // Update the internal checked state
        state.checked = value;

        // If the toggle elements are not yet initialized, we cannot update their state, so we return early
        if (state.toggleElement === undefined) {
            return;
        }

        // Set the toggle state of the input element
        state.toggleInputElement.checked = value;

        // Update the toggle's visual state
        state.toggleElement.classList.toggle(styles.checked, value);
    }

    get label() {
        const state = states.get(this);

        return state.label;
    }

    constructor({
        label = '',
        defaultChecked = false,
        onChange = null,
    } = {}) {
        states.set(this, {
            label,
            checked: defaultChecked,
            onChange,
        });
    }

    render() {
        const state = states.get(this);

        // Create a template element to hold the toggle switch structure
        const container = document.createElement('template');

        // Set the inner HTML of the template to create the toggle switch structure
        container.innerHTML = `
            <span class="${styles.toggle}">
                <label class="${styles.label}">
                    <input type="checkbox" class="${styles.input}">
                    <span aria-hidden="true" class="${styles.facade}"></span>
                    <span class="${styles.text}">${this.label}</span>
                </label>
            </span>
        `;

        // Store references to the toggle elements in the state for later use
        state.toggleElement = container.content.querySelector(`span.${styles.toggle}`);
        state.toggleInputElement = container.content.querySelector(`input.${styles.input}`);

        // Initialize the toggle state based on the internal checked property
        state.toggleInputElement.checked = this.checked;
        state.toggleElement.classList.toggle(styles.checked, this.checked);

        // Add event listener for toggle changes
        state.toggleInputElement.addEventListener('change', async event => {
            const isChecked = event.target.checked === true;

            // Update the internal state
            this.checked = isChecked;

            // Call the onChange callback if provided
            state.onChange?.(isChecked);
        });

        // Return the content of the template, which contains the toggle switch elements
        return container.content;
    }
}
