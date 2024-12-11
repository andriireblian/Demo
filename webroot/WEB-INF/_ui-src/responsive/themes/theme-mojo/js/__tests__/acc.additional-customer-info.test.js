require('../acc.additional-customer-info');

describe('Add test for acc.additional-customer-info.js file', () => {
    const registerForm = `
        <form id="pearsonRegistrationForm">
            <div class="form-group">
                <label class="control-label " for="studyLevel">
                    Role *
                </label>
                <div class="c-select-wrapper">
                    <select id="studyLevel"
                            class="input js-study-level-select">
                        <option value="" disabled="disabled" selected="selected">Choose your role</option>
                        <option data-is-educator="false" value="COLLEGE_STUDENT_UNDERGRADUATE">
                                College student - undergraduate</option>
                        <option data-is-educator="false" value="COLLEGE_STUDENT_GRADUATE">
                                College student - graduate</option>
                        <option data-is-educator="false" value="PROFESSIONAL_EXCLUDING_FACULTY_AND_INSTRUCTORS">
                                Professional - excluding faculty, instructors</option>
                        <option data-is-educator="false" value="HIGH_SCHOOL_STUDENT">
                                High school student</option>
                        <option data-is-educator="true" value="FACULTY_OR_INSTRUCTOR">
                                Faculty or instructor</option>
                    </select>
                </div>
            </div>
            <div class="form-group js-user-date-of-birth">
                <label class="control-label input-label " for="dobID">
                        Month and year of birth *</label>
                <input id="dobID"

                    name="dateOfBirth"
                    class="input js-age-getting-field"
                    type="text">
                    <p class="input-hint" id="dob-hint">
                        Format: MM-YYYY</p>
                    <p class="input-hint hidden" id="minor-message">
                        It looks like you’re under 18. For now, you’ll only receive emails about your account.</p>
            </div>
            <div class="form-group js-profile-institution">
                <input id="profile-institution-id" name="institution.id" class="form-control" type="hidden" value="">
                <label class="control-label " for="profile-institution-component">
                    School or institution
                </label>
                <div class="profile-institution-wrapper">
                    <input id="profile-institution-component" class="input text ui-autocomplete-input"
                        type="text" value="" pattern="^[^*?]*$" placeholder="Add your institution"
                        aria-activedescendant="" data-institution-url="register"
                        role="combobox" aria-autocomplete="list" autocomplete="organization"
                        aria-controls="ui-id-1" aria-expanded="false"
                    >
                    <button type="button" class="profile-institution-reset-btn">
                        <span class="screenreader">
                            Clear selected school value</span>
                    </button>
                    <ul id="ui-id-1" tabindex="0" class="ui-menu ui-widget ui-widget-content ui-autocomplete ui-front"
                        role="listbox" aria-label="Institutions" style="display: none;"></ul>
                </div>
            </div>
        </form>
    `;
    const handleDateOfBirthVisibility = jest.spyOn(ACC.additionalCustomerInfo, 'handleDateOfBirthVisibility');
    const triggerChangeEvent = jest.spyOn(ACC.additionalCustomerInfo, 'triggerChangeEvent');
    const modalContainerAndTemplate = `
        <div id="additionalCustomerInfoModal">
            <div id="cboxTitle">
                <h4 class="headline">Please select your role</h4>
            </div>
            <div class="popup-content">
                <div class="modal-details">
                    <p>This helps us show you content that's right for your level of education and goals.</p>
                </div>
            </div>
        </div>
        <script id="additionalCustomerInfoModalTemplate" type="text/x-jquery-tmpl"></script>
    `;
    let roleSelect;
    let dobGroup;
    let dateOfBirthField;
    const fetchResults = {
        fetchDateOfBirth: true,
        fetchStudyLevel: true,
    };
    const location = {
        ...window.location,
        search: '?foo=bar&test=01&upgrade_subscription=true',
    };
    const onDone = jest.fn();
    Object.defineProperty(window, 'location', {
        writable: true,
        value: location,
    });

    beforeEach(() => {
        document.body.innerHTML = registerForm;
        roleSelect = document.getElementById('studyLevel');
        dobGroup = document.querySelector('.js-user-date-of-birth');
        dateOfBirthField = dobGroup.querySelector('.js-age-getting-field');
        ACC.additionalCustomerInfo.bindRoleValueChange();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    test('should not to show birthday field group on registration when user choose educator role', () => {
        roleSelect.value = 'FACULTY_OR_INSTRUCTOR';
        roleSelect.dispatchEvent(new Event('input'));

        expect(handleDateOfBirthVisibility).toHaveBeenCalled();
        expect(dobGroup.classList.contains('display-none')).toBeTruthy();
        expect(dateOfBirthField.hasAttribute('disabled')).toBeTruthy();
        expect(dateOfBirthField.getAttribute('aria-required')).toBe('false');
        expect(triggerChangeEvent).toHaveBeenCalled();
    });

    test('show birthday field group on registration when user choose any role except educator', () => {
        roleSelect.value = 'HIGH_SCHOOL_STUDENT';
        roleSelect.dispatchEvent(new Event('input'));

        expect(handleDateOfBirthVisibility).toHaveBeenCalled();
        expect(dobGroup.classList.contains('display-none')).toBeFalsy();
        expect(dateOfBirthField.hasAttribute('disabled')).toBeFalsy();
        expect(dateOfBirthField.getAttribute('aria-required')).toBe('true');
    });

    test('redirect user if no template and container', () => {
        ACC.additionalCustomerInfo.triggerInfoModal(fetchResults, onDone);
        expect(onDone).toBeCalled();
    });

    test('modal window should be opened', () => {
        document.body.innerHTML = modalContainerAndTemplate;
        $modal.open = jest.fn();
        ACC.additionalCustomerInfo.triggerInfoModal(fetchResults, onDone);
        expect($modal.open).toHaveBeenCalled();
    });
});
