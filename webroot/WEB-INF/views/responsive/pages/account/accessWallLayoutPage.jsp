<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template"%>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:theme code="access.wall.page.title" var="authorablePageTitle" htmlEscape="true"/>

<template:page pageTitle="${not empty authorablePageTitle? authorablePageTitle: pageTitle}">
    <cms:pageSlot position="BodyContent" var="feature" element="section" class="access-wall">
        <cms:component component="${feature}" />
    </cms:pageSlot>
</template:page>