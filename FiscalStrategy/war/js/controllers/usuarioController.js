app.service("usuarioservice",['$http', '$q', function($http, $q){
	this.crearUsuario = function(usuario) {
		var d = $q.defer();
		$http.post("/usuario/registro", usuario).then(
				function(response) {
					console.log(response);
					d.resolve(response.data);
				},
				function(response) {
					if(response.status==400){
					alert("No se puede crear "
							+ usuario.usuario + " usuario o correo no disponibles");
					}if(response.status==403){
						//alert("No tiene permiso de realizar esta acción");
						$location.path("/login");
					}
					d.reject(response);
					$window.location.reload;
				});
		return d.promise;
	}
	
	this.consultarUsuariosTodos = function() {
		var d = $q.defer();
		$http.get("/usuario/consultarTodos").then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				//alert("No tiene permiso de realizar esta acción");
				$location.path("/login");
			}
		});
		return d.promise;
	}
	this.eliminaUsuario = function(usuario) {
		var d = $q.defer();
		$http.post("/usuario/elimina", usuario).then(
				function(response) {
					console.log(response);
					d.resolve(response.data);
				}, function(response) {
				});
		return d.promise;
	};
	this.actualizarUsuario = function(usuario) {
		var d = $q.defer();
		$http.post("/usuario/actualiza", usuario).then(
				function(response) {
					console.log(response);
					d.resolve(response.data);
				}, function(response) {
				});
		return d.promise;
	};
	
}]);

app.service("perfilservice",['$http', '$q', function($http, $q){
	
}]);
app.controller("userController",['$scope','$window', '$location', '$cookieStore','usuarioservice', function($scope, $window, $location, $cookieStore, usuarioservice){
	

	  
	$scope.enviarFormulario = function() {
		usuarioservice
				.crearUsuario($scope.usuario)
				.then(
						function(data) {
							alert("Usuario creado correctamente");
							$location
									.path("/modificarusuarios");
						});
	}
	
	
//	$scope.cargarPagina(1);
	
}]);
app.controller("controladorListaUsuarios", [ '$scope', 'usuarioservice',
	'perfilservice', '$location', '$window',
	function($scope, usuarioservice, perfilservice, $location, $window) {

		usuarioservice.consultarUsuariosTodos().then(function(data) {
			$scope.usuariosLista = data;
		})

		

		$scope.actualizarUsuario = function($scope) {
			console.log($scope);
			usuarioservice.actualizarUsuario($scope).then(function(data) {
				alert("Usuario modificado correctamente");
				$window.location.reload();
			});
		}

		$scope.eliminarUsuario = function($scope) {
			console.log($scope);
			usuarioservice.eliminaUsuario($scope).then(function(data) {
				alert("Usuario eliminado correctamente");
				$window.location.reload();
			})
		}
	} ]);

