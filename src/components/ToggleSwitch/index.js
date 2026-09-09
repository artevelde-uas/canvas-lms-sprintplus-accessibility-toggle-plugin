import styles from './index.module.css';


const state = new WeakMap();


export default class ToggleSwitch {

    get checked() {
        return state.get(this).checked;
    }
    set checked(value) {
        const self = state.get(this);

        // Update the internal checked state
        self.checked = value;

        // If the toggle elements are not yet initialized, we cannot update their state, so we return early
        if (self.toggleElement === undefined) {
            return;
        }

        // Set the toggle state of the input element
        self.toggleInputElement.checked = value;

        // Update the toggle's visual state
        self.toggleElement.classList.toggle(styles.checked, value);
    }

    get label() {
        return state.get(this).label;
    }

    constructor({
        label = '',
        defaultChecked = false,
        onChange = null,
    } = {}) {
        state.set(this, {
            label,
            checked: defaultChecked,
            onChange,
        });
    }

    render() {
        const self = state.get(this);

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
        self.toggleElement = container.content.querySelector(`span.${styles.toggle}`);
        self.toggleInputElement = container.content.querySelector(`input.${styles.input}`);

        // Initialize the toggle state based on the internal checked property
        self.toggleInputElement.checked = this.checked;
        self.toggleElement.classList.toggle(styles.checked, this.checked);

        // Add event listener for toggle changes
        self.toggleInputElement.addEventListener('change', async event => {
            const isChecked = event.target.checked === true;

            // Update the internal state
            this.checked = isChecked;

            // Call the onChange callback if provided
            self.onChange?.(isChecked);
        });

        // Return the content of the template, which contains the toggle switch elements
        return container.content;
    }
}
