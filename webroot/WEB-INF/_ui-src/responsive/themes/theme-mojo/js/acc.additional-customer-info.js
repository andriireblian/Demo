ACC.additionalCustomerInfo = {

    _autoload: [
        ['bindRoleValueChange', document.querySelector('#studyLevel') && document.querySelector('#dobID')],
    ],

    educatorRole: false,

    triggerInfoModal(data, onDone) {
        const targetContainer = document.getElementById('additionalCustomerInfoModal');
        const template = document.getElementById('additionalCustomerInfoModalTemplate');
        if (!targetContainer && !template) {
            onDone();
            return;
        }

        $modal.open(null, {
            escKey: false,
            overlayClose: false,
            closeButton: false,
            href: targetContainer,
            inline: true,
            className: 'additional-customer-info-modal',
            onLoad() {
                const { fetchDateOfBirth, fetchStudyLevel } = data;
                $(targetContainer).html($(template).tmpl(data));

                ACC.validation.addValidationMethods();
                ACC.validation.bindFormValidation();
                ACC.additionalCustomerInfo.processSavingDataRequest(onDone);

                if (fetchDateOfBirth && fetchStudyLevel) {
                    ACC.additionalCustomerInfo.bindRoleValueChange();
                }
                ACC.additionalCustomerInfo.handleFormValidState();
                ACC.tooltipPlugin.init();
            },
        });
    },

    processSavingDataRequest(onDone) {
        const form = document.getElementById('additionalCustomerInfoForm');

        if (!form) {
            onDone();
        }
        const url = form.getAttribute('action');
        const btn = form.querySelector('.js-marketing-modal-btn-confirm');
        const iesUserId = piSession.userId();
        const userToken = ACC.upcConsents.getPiSessionToken();
        btn.addEventListener('click', (e) => {
            // avoid to execute the actual submit of the form.
            e.preventDefault();
            btn.setAttribute('disabled', 'disabled');
            const params = new URLSearchParams([...new FormData(form).entries()]);
            fetch(url, {
                method: 'POST',
                body: params,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.isMinorUser) {
                        ACC.upcConsents.sendUpcConsentsAdditional(false, iesUserId, userToken, onDone, 'MINOR');
                    } else {
                        ACC.customlogin.triggerUpcConsentPage(onDone);
                    }
                }).catch((error) => {
                    console.log(error);
                    onDone();
                });
        });
    },

    handleFormValidState() {
        const form = document.getElementById('additionalCustomerInfoForm');
        if (!form) {
            return;
        }
        const btn = form.querySelector('.js-marketing-modal-btn-confirm');
        form.querySelectorAll('.input').forEach((element) => {
            element.addEventListener('input', () => {
                if ($(form).validate().checkForm()) {
                    btn.removeAttribute('disabled');
                } else {
                    btn.setAttribute('disabled', 'disabled');
                }
            });
        });
    },

    bindRoleValueChange() {
        const roleFields = document.querySelectorAll('.js-study-level-select');

        roleFields.forEach((element) => {
            const currentForm = element.closest('form');
            const dateOfBirthGroup = currentForm.querySelector('.js-user-date-of-birth');
            const profileInstitution = currentForm.querySelector('.js-profile-institution');
            if (!dateOfBirthGroup) {
                return;
            }
            const dateOfBirthField = dateOfBirthGroup.querySelector('.js-age-getting-field');

            element.addEventListener('input', (e) => {
                if (e.target.selectedOptions[0].getAttribute('data-is-educator') === 'true') {
                    ACC.additionalCustomerInfo.educatorRole = true;
                    if (currentForm.id === 'pearsonRegistrationForm') {
                        ACC.additionalCustomerInfo.handleDateOfBirthVisibility({
                            formGroup: dateOfBirthGroup,
                            inputField: dateOfBirthField,
                            visibility: false,
                        });
                        ACC.additionalCustomerInfo.triggerChangeEvent(dateOfBirthField);
                    } else if (dateOfBirthField.value
                        && !(document.getElementById('pearsonRegistrationSecondStepForm'))
                    ) {
                        ACC.additionalCustomerInfo.handleDateOfBirthVisibility({
                            formGroup: dateOfBirthGroup,
                            inputField: dateOfBirthField,
                            visibility: true,
                        });
                    } else {
                        ACC.additionalCustomerInfo.handleDateOfBirthVisibility({
                            formGroup: dateOfBirthGroup,
                            inputField: dateOfBirthField,
                            visibility: false,
                        });
                    }
                } else {
                    ACC.additionalCustomerInfo.educatorRole = false;
                    ACC.additionalCustomerInfo.handleDateOfBirthVisibility({
                        formGroup: dateOfBirthGroup,
                        inputField: dateOfBirthField,
                        institutionGroup: profileInstitution,
                        visibility: true,
                    });
                }
            });
        });
    },

    handleDateOfBirthVisibility(data) {
        const {
            formGroup, inputField, institutionGroup, visibility,
        } = data;
        const monthField = document.querySelector('#dobMonthID');
        const yearField = document.querySelector('#dobYearID');

        if (visibility) {
            inputField.setAttribute('aria-required', 'true');
            if (monthField && yearField) {
                monthField.removeAttribute('disabled');
                yearField.removeAttribute('disabled');
            }
            inputField.removeAttribute('disabled');
            formGroup.classList.remove('display-none');
            if (institutionGroup) {
                institutionGroup.classList.remove('display-none');
            }
        } else {
            if (monthField && yearField) {
                ACC.additionalCustomerInfo.disableHiddenInputs(monthField);
                ACC.additionalCustomerInfo.disableHiddenInputs(yearField);
            }
            ACC.additionalCustomerInfo.disableHiddenInputs(inputField);
            formGroup.classList.remove('has-error');
            formGroup.classList.add('display-none');
        }
    },

    disableHiddenInputs(input) {
        input.setAttribute('disabled', 'disabled');
        input.setAttribute('aria-required', 'false');
        input.removeAttribute('aria-invalid');
    },

    triggerChangeEvent(input) {
        input.dispatchEvent(new Event('input'));
    },
};
