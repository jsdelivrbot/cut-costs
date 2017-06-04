package com.boot.cut_costs.exception;

import java.util.HashMap;
import java.util.Map;

import javax.validation.ValidationException;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionHandlingAdvice {
    
	private static final Map<String, HttpStatus> ERROR_STATUS_MAP = createHttpStatusCodesMap();

	private static Map<String, HttpStatus> createHttpStatusCodesMap() {
        Map<String,HttpStatus> erro_status_map = new HashMap<String,HttpStatus>();
        
        erro_status_map.put(BadRequestException.class.getName(), HttpStatus.BAD_REQUEST); // 400
        erro_status_map.put(ValidationException.class.getName(), HttpStatus.BAD_REQUEST); // 400
        erro_status_map.put(BadCredentialsException.class.getName(), HttpStatus.UNAUTHORIZED); // 401
        erro_status_map.put(AccessDeniedException.class.getName(), HttpStatus.FORBIDDEN); // 403
        erro_status_map.put(ResourceNotFoundException.class.getName(), HttpStatus.NOT_FOUND); // 404
        erro_status_map.put(DuplicateUsernameException.class.getName(), HttpStatus.CONFLICT); // 409

        return erro_status_map;
    }
    
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<String> RuntimeExceptionHandler(RuntimeException e) throws JSONException {
		HttpStatus statusCode = ERROR_STATUS_MAP.get(e.getClass().getName());
		if (statusCode == null) {
			return new ResponseEntity<String>("", HttpStatus.INTERNAL_SERVER_ERROR);
		}
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
		JSONObject response = new JSONObject();
		response.put("message", e.getMessage());
		return new ResponseEntity<String>(response.toString(), headers, ERROR_STATUS_MAP.get(e.getClass().getName()));
	}
}