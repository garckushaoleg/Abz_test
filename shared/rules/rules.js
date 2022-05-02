export class Rules {
	static maxNumberOfSymbols(value, message) {
		return (value || '').length <= 60 || message;
	}

	static minNumberOfSymbols(value, message) {
		return (value || '').length >= 2 || message;
	}

	static validEmail(value, message) {
		return /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/.test(value) || message;
	}

	static validPhone(value, message) {
		return /^[\+]{0,1}380([0-9]{9})$/.test(value) || message;
	}

	static isRequiredField(value, message) {
		return !!value || message;
	}
}
