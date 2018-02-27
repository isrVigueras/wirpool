package com.tikal.fiscal.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class Notificacion {

	@Id private Long id;
	@Index private Long idOt;
	@Index private Long responsable;
	private String mensaje;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getIdOt() {
		return idOt;
	}

	public void setIdOt(Long idOt) {
		this.idOt = idOt;
	}

	public Long getResponsabe() {
		return responsable;
	}

	public void setResponsabe(Long responsabe) {
		this.responsable = responsabe;
	}

	public String getMensaje() {
		return mensaje;
	}

	public void setMensaje(String mensaje) {
		this.mensaje = mensaje;
	}
	
	
	

}
