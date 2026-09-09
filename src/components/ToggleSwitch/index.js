import styles from './index.module.css';


const state = new WeakMap();


export default class ToggleSwitch {

    get checked() {
        return state.get(this).checked;
    }
    set checked(value) {
        state.get(this).checked = value;

        // If the toggle elements are not yet initialized, we cannot update their state, so we return early
        if (state.get(this).toggleElement === undefined) {
            return;
        }

        // Set the toggle state of the input element
        state.get(this).toggleInputElement.checked = value;

        // Update the toggle's visual state
        state.get(this).toggleElement.classList.toggle(styles.checked, value);
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
        // Create a template element to hold the toggle switch structure
        const container = document.createElement('template');

        // Set the inner HTML of the template to create the toggle switch structure
        container.innerHTML = `
            <span data-testid="sprintplus-toggle" class="${styles.toggle}">
                <input type="checkbox" id="sprintplus-toggle-input" class="${styles.input}">
                <label for="sprintplus-toggle-input" class="${styles.label}">
                    <span aria-hidden="true" class="${styles.facade}"></span>
                    <span class="${styles.text}">${this.label}</span>
                </label>
            </span>
        `;

        // Get references to the toggle elements
        const toggleElement = container.content.querySelector('[data-testid="sprintplus-toggle"]');
        const toggleInputElement = toggleElement.querySelector('#sprintplus-toggle-input');

        // Store references to the toggle elements in the WeakMap
        state.get(this).toggleElement = toggleElement;
        state.get(this).toggleInputElement = toggleInputElement;

        // Initialize the toggle state based on the internal checked property
        toggleInputElement.checked = this.checked;
        toggleElement.classList.toggle(styles.checked, this.checked);

        // Add event listener for toggle changes
        toggleInputElement.addEventListener('change', async event => {
            const isChecked = event.target.checked === true;

            // Update the internal state
            this.checked = isChecked;

            // Call the onChange callback if provided
            state.get(this).onChange?.(isChecked);
        });

        // Return the content of the template, which contains the toggle switch elements
        return container.content;
    }
}
