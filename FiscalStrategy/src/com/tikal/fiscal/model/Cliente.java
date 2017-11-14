package com.tikal.fiscal.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class Cliente {
	@Id private Long id;
	
	@Index private String nickname;
	private String tipo;
	@Index private Long responsable;
	@Index private Long idBrocker; 
	
	public Long getResponsable() {
		return responsable;
	}
	public void setResponsable(Long responsable) {
		this.responsable = responsable;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public Long getIdBrocker() {
		return idBrocker;
	}
	public void setIdBrocker(Long idBrocker) {
		this.idBrocker = idBrocker;
	}
	
	
}
