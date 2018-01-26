app.factory("datosUsuario", function(){
	var us={
			id:null,
		    usuario:null,
		    pass=null,
		    perfil:null,
		    email:null,
	}
	
    getId=function(){
    	return us.id;
    }
    
    setId=function(idUser){
    	us.id=idUser
    }
    
    getNombre=function(){
    	return us.usuario
    }
    
    setNombre=function(us){
    	us.usuario=us;
    }
    
    getPerfil=function(){
    	return us.perfil;
    }
    
    setPerfil=function(p){
    	return us.perfil=p;
    }
    getUsuario=function(){
    	return us;
    }
    
    setUsuario=function(u){
    	us=u;
    }
    
    
});