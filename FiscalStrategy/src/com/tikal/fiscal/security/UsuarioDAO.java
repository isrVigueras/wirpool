package com.tikal.fiscal.security;

import java.util.List;

import com.tikal.fiscal.model.Usuario;

public interface UsuarioDAO {
	
	public boolean crearUsuario(Usuario usuario);
	public boolean eliminarUsuario(String usuario);
	public Usuario consultarUsuario(String usuario);
	public List<Usuario> consultarUsuarios();
	public boolean actualizarUsuario(Usuario usuario, boolean pr);
	public boolean eliminarUsuario(Usuario usuario);
	public boolean actualizarUsuarios(String nombrePerfilviejo, String nombrePerfilNuevo);
	public Usuario consultarPorEmail(String email);
	public Usuario consultarPorPerfil(String perfil);
	public List<Usuario> consultarPorPerfilAll(String perfil);
	public Usuario consultarId(Long id);
}