<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="user" tagdir="/WEB-INF/tags/responsive/user" %>
<%@ taglib prefix="address" tagdir="/WEB-INF/tags/responsive/address"%>

<div class="registerPersona__section">
    <c:set value="/register/contact-address" var="submitUrl"/>
    <c:url value="${submitUrl}" var="registerContactAddressUrl"/>
    <user:registerPersonaContactAddress actionNameKey="text.register.contact.address.btn.continue" action="${registerContactAddressUrl}" countries="${countries}"/>
    <div class="hidden">
        <address:suggestedAddressesProfileForm selectedAddressUrl="${submitUrl}/suggestions"/>
    </div>
</div>