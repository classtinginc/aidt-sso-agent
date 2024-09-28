/**
 * Global Variables Settings
 */

/* SSO Server, Agent Url Settings */
const AGENT_HOST = "https://sso.aidt.classting.dev";
const SERVER_HOST = "https://sdv.aidtbook.kr";

const LOCAL_URL = removeAllQueryParametersAndReturn(location.href);

/* if LOG_OUT_URL IS NULL Then Don't Move Page */
const LOG_OUT_URL = "https://sdv.aidtbook.kr/sso/pmi-logout-url.jsp?returl=https://sso.aidt.classting.dev/sso/index.html";
const returlParam = "?uuid=test";
const customstorage = new LocalStorageDTO();
/**
 * Perform a live check on the server.
 */
function KSign_Server_LiveCheck() {
    console.warn('Invoking function: KSign_Server_LiveCheck');

    $.ajax({
        url: AGENT_HOST + "/sso/sso-server-livecheck",
        method: "POST",
        dataType: "json",
        success: function(response) {
            console.log(response);
        },
        error: function(xhr, status, error) {
            console.error("Failed to retrieve data. Status code: " + xhr.status);
        }
    });
}

/**
 * Perform a live check on the agent.
 */
function KSign_Agent_LiveCheck() {
    console.warn('Invoking function: KSign_Agent_LiveCheck');

    $.ajax({
        url: AGENT_HOST + "/liveCheckRequest",
        method: "GET",
        contentType: 'application/json',
//        data: JSON.stringify({}),
        xhrFields: {
            withCredentials: true
        },
        success: function(response) {
            console.log(response);
        },
        error: function(xhr, status, error) {
            console.error("Failed to retrieve data. Status code: " + xhr.status);
        }
    });
}

/**
 * Make a request for a Single Sign-On (SSO) token.
 */
function makeSSOReq() {
    console.warn('Invoking function: makeSSOReq');
    var url = AGENT_HOST + "/makeTokenRequest";
    var reqParam = {
        authenMethod: "form-based",
        returnUrl: LOCAL_URL,
        sessionId: null
    };

    var reqBody = JSON.stringify(reqParam);
	
    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        xhrFields: {
            withCredentials: true
        },
        data: reqBody,
        success: function(response) {
            if (response.message === 'token') {
                console.log(response);
                console.log(response.object.keyId);
                
                customstorage.setItem("keyId", response.object.keyId);
                //customstorage.setItem("AM", response.object.tokenMap.AM);
                //customstorage.setItem("UID", response.object.tokenMap.UID);
                //customstorage.setItem("access_token", response.object.tokenMap.access_token);
                //customstorage.setItem("name", response.object.tokenMap.name);
                $("#AM").val(response.object.tokenMap.AM);
		 		$("#UID").val(response.object.tokenMap.UID);
		 		$("#access_token").val(response.object.tokenMap.access_token);
		 		$("#name").val(response.object.tokenMap.name);
                return;
            }
            respJson = response;
            if (respJson != null) {
                var respStatus = respJson.code;
                if (respStatus === 200) {
                    var pmisso = respJson.object;
                    var pmiSSO = "pmi-sso=" + encodeURIComponent(pmisso.tokenRequest);
                    var from = "from=" + encodeURIComponent(pmisso.from);
                    var retUrl = "returl=" + encodeURIComponent(pmisso.returl + returlParam);
                    var sinfo = "sinfo=" + encodeURIComponent(pmisso.sinfo);
                    var challenge = "challenge=" + encodeURIComponent(pmisso.challenge);
					var secure = pmisso.securenonce;
                    var keyId = pmisso.keyId;
                    customstorage.setItem("sn", secure);
                    customstorage.setItem("keyId", keyId);

                    var SSO_SERVER = SERVER_HOST + "/pmi-sso.jsp";
                    var finalUrl = SSO_SERVER + "?"
                    + pmiSSO + "&" 
                    + challenge + "&"
                    + from + "&" 
                    + sinfo + "&" 
                    + retUrl;
                    location.href = finalUrl;
                    console.log(respStatus);
                } else {
                    console.error("Error: " + respStatus);
                }
            }
        },
        error: function(xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}

/**
 * Verify the Single Sign-On (SSO) token.
 */
function verifyToken() {
    console.warn('Invoking function: verifyToken');
    if(!getUrlParameter("pmi-sso-return")){
		console.log('pmi-sso-return is null');
		console.log('pmi-sso-return : '+getUrlParameter("pmi-sso-return"));
		makeSSOReq();
		return;
	}
    var encryptedToken = getUrlParameter("pmi-sso-return");
    var keyId = customstorage.getItem("keyId");
    if(keyId == 'null' || keyId == null || keyId == ''){
		console.log('keyId is null');
		console.log('keyId : '+ keyId);
		makeSSOReq();
	}
    var url = AGENT_HOST + "/verifyTokenResponse";
    var sn = customstorage.getItem("sn");
    var reqParam = {
        keyId: keyId,
        encryptedToken: encryptedToken,
        securenonce: sn
    };

    var reqBody = JSON.stringify(reqParam);

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        xhrFields: {
            withCredentials: true
        },
        data: reqBody,
        success: function(response) {
            console.log(response);
//            localStorage.setItem("keyId", response.object.keyId);
//            customstorage.setItem("AM", response.object.tokenMap.AM);
//            customstorage.setItem("UID", response.object.tokenMap.UID);
//            customstorage.setItem("access_token", response.object.tokenMap.access_token);
//            customstorage.setItem("name", response.object.tokenMap.name);
				$("#AM").val(response.object.tokenMap.AM);
		 		$("#UID").val(response.object.tokenMap.UID);
		 		$("#access_token").val(response.object.tokenMap.access_token);
		 		$("#name").val(response.object.tokenMap.name);			
        },
        error: function(xhr, status, error) {
//       	ssoFail();
            console.error("Error: status ["+xhr+"]:" + error);
        }
    });
}

/**
 * Invalidate the Single Sign-On (SSO) token.
 */
function invalidateToken() {
    console.warn('Invoking function: invalidateToken');
    var url = AGENT_HOST + "/sessionTokenInvalidate";
    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        xhrFields: {
            withCredentials: true
        },
        success: function(response) {
            console.log(response);
            if(response === 'invalidateSuccess'){
				console.log('Agent Session Token is invalidated');
				console.warn('Clearing all data from localStorage');
				customstorage.clear();
				console.log('localStorage has been cleared');
			}
            
        },
        error: function(xhr, status, error) {
            console.error("Error: " + error);
        }
    });
    removeUrlParameterAndReloadAndMoveLogoutPage();
	
}

/**
 * Get URL parameter by name.
 */
function getUrlParameter(sParam) {
    console.warn('Invoking function: getUrlParameter');
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

//window.addEventListener('beforeunload', () => {
//	localStorage.clear();
//});

$(document).ready(function(){

	var intervalId;
	intervalId = setInterval(localStorageCheck, 1000);
	var returnUrl = location.href;
	ssocheck(returnUrl);
});

function localStorageCheck(){
  	$("#keyId").val(customstorage.getItem("keyId"));
  	$("#encryptedToken").val(customstorage.getItem("encryptedToken"));
 	
}

function tokenCheck() {
    var ssoToken = getUrlParameter("pmi-sso-return");
    var keyCheck = customstorage.getItem("keyId");

    if (ssoToken != null && ssoToken != "") {
		console.log('pmi-sso-return is not null');
        return true;
    } else if (keyCheck != null && keyCheck != "") {
		console.log('keyId is not null');
        return true;
    } else {
        return false;
    }
}

function ssocheck(returnUrl) {
    if (tokenCheck()) {
        verifyToken();
    } else {
        makeSSOReq();
    }
}

/**
 * Remove all query parameters from the URL and reload the page with the updated URL.
 */
function removeAllQueryParametersAndReturn(locationUrl) {
    console.warn('Removing all query parameters');
    // Get the current URL
    const url = new URL(locationUrl);
    // Clear all query parameters
    url.search = '';
    // Log the updated URL
    console.log(`Updated URL: ${url.href}`);
    // Reload the page with the updated URL
    return url.href;
}

/**
 * Remove specified parameter from URL and reload the page with the updated URL.
 * @param {string} param - The parameter to remove from the URL.
 */
function removeUrlParameterAndReloadAndMoveLogoutPage() {
//    console.warn(`Removing parameter: ${param}`);
//    
//    // Get the current URL
//    const url = new URL(window.location.href);
//    
//    // Remove the specified parameter
//    url.searchParams.delete(param);
//    
//    // Log the updated URL
//    console.log(`Updated URL: ${url.href}`);
    
//    if(LOG_OUT_URL != null){
	    // 이동 전 URL 형식 검사
//	    try {
//	        new URL(LOG_OUT_URL); // 유효한 URL인지 검사
//	        location.href = LOG_OUT_URL;
//	    } catch (e) {
//	        alert('Invalid URL:', e);
//	    }
//	}
		location.href = LOG_OUT_URL
//    
    // Reload the page with the updated URL
//    window.location.href = url.href;
    
}

function ssoFail() {
	alert("로그인 상태가 아닙니다.");
	localStorage.clear();
	history.back();	
}