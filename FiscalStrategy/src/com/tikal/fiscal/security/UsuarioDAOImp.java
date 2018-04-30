package com.tikal.fiscal.security;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.tikal.fiscal.model.Usuario;

@Repository
public class UsuarioDAOImp implements UsuarioDAO {

	@Override
	public boolean crearUsuario(Usuario usuario) {

		if(this.consultarPorEmail(usuario.getEmail()).getEmail()!=null){
			return false;
		}
		if (this.consultarUsuario(usuario.getUsername())==null) {
			ofy().save().entity(usuario).now();
		} else {
			return false;
		}

		return true;
	}

	@Override
	public boolean eliminarUsuario(String usuario) {
		ofy().delete().entities(this.consultarUsuario(usuario)).now();
		return true;
	}

	@Override
	public Usuario consultarUsuario(String usuario) {
		List<Usuario> usu = ofy().load().type(Usuario.class).filter("usuario", usuario).list();
		if (usu.size() == 0) {
			return null;
		}
		Usuario nuevo = usu.get(0);
		return nuevo;
	}

	@Override
	public List<Usuario> consultarUsuarios() {

		return ofy().load().type(Usuario.class).list();
	}

	@Override
	public boolean actualizarUsuario(Usuario usuario, boolean pr) {
		if(!pr){
			Usuario aux= this.consultarPorEmail(usuario.getEmail());
			usuario.setPass(aux.getPassword());
		}
		ofy().save().entity(usuario).now();
		return true;
	}

	@Override
	public boolean eliminarUsuario(Usuario usuario) {
		ofy().delete().entity(usuario).now();
		return true;
	}

	@Override
	public boolean actualizarUsuarios(String nombrePerfilviejo, String nombrePerfilNuevo) {
		List<Usuario> lista =  ofy().load().type(Usuario.class).filter("perfil", nombrePerfilviejo).list();
		for(int i = 0; i < lista.size(); i++){
			lista.get(i).setPerfil(nombrePerfilNuevo);
		}
		ofy().save().entities(lista).now();
		return true;
	}

	@Override
	public Usuario consultarPorEmail(String email) {
		List<Usuario> lista = ofy().load().type(Usuario.class).filter("email", email).list();	
//		System.out.println("Tamaño de la lista: " + lista.size());
		Usuario usuario = new Usuario();
		if(lista.size()>0){
			return lista.get(0);
		}
		return usuario;	
	}

	@Override
	public Usuario consultarId(Long id) {
		return ofy().load().type(Usuario.class).id(id).now();
	}

	@Override
	public Usuario consultarPorPerfil(String perfil) {
		List<Usuario> lista = ofy().load().type(Usuario.class).filter("perfil", perfil).list();	
		Usuario usuario = new Usuario();
		if(lista.size()>0){
			return lista.get(0);
		}
		return usuario;	
	}
	
	@Override
	public List<Usuario> consultarPorPerfilAll(String perfil) {
		List<Usuario> lista = ofy().load().type(Usuario.class).filter("perfil", perfil).list();	
		
		return lista;
	}
}
