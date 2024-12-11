<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="recaptchaaddon" tagdir="/WEB-INF/tags/addons/pmcgooglerecaptchaaddon/responsive" %>
<%@ taglib prefix="feature" tagdir="/WEB-INF/tags/addons/pmcsharedaddon/responsive/feature" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true"/>

<div class="existing-org-popup-form-wrapper">
    <p class="title">
        <spring:theme code="text.register.existing.organisation.subtitle"/>
    </p>

    <p><spring:theme code="text.register.existing.organisation.label1" arguments="${searchData.name}" htmlEscape="false"/></p>

    <p><spring:theme code="text.register.existing.organisation.label2"/></p>

    <c:forEach items="${existingOrganizations}" var="organization">
        <label class="js-existing-org-radio-button c-radiobtn c-boxed" for="orgItem-${organization.accountNumber}">
            <input class="c-radiobtn__input"
                   type="radio" name="newOrgFormGroup" id="orgItem-${organization.accountNumber}"
                   value="orgItem-${organization.accountNumber}" data-account-number="${organization.accountNumber}"
                   data-postal-code="${organization.zipCode}" data-country="${organization.country}"/>
            <span class="c-radiobtn__check">${organization.name}</span>
            <feature:feature code="register.organisation.vb4c">
                <c:if test="${organization.hasQGlobalAccounts}">
                    <p><spring:theme code="register.organisation.existing.qglobal.account.note"/></p>
                </c:if>
            </feature:feature>
            <p>${organization.address}</p>
            <c:if test="${!fn:contains(countriesWithoutPostCode, organization.country)}">
                <p>${organization.zipCode}</p>
            </c:if>
            <p class="clearfix">${organization.country}</p>
        </label>
    </c:forEach>
</div>
