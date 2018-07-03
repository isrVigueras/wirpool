var app=angular.module("app",['ngRoute', 'ngCookies',]);
app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/notificaciones', {
		templateUrl : "pages/Notificaciones.html",
		controller : "notificacionesController"
	});
	$routeProvider.when('/login', {
		templateUrl : "pages/login.html",
		controller : "navigation"
	});
	$routeProvider.when('/altaPagos', {
		templateUrl : "pages/altaPagos.html",
		controller : "pagosAddController"
	});
	$routeProvider.when('/listaPagos', {
		templateUrl : "pages/listaPagos.html",
		controller : "ListaPagoController"
	});
	$routeProvider.when('/altaOTs', {
		templateUrl : "pages/altaOTs.html",
		controller: "OTsAddController"
	});
	$routeProvider.when('/otCA', {
		templateUrl : "pages/CA.html",
		controller: "CAController"
	});
	$routeProvider.when('/listaOTs', {
		templateUrl : "pages/listOTs.html",
		controller : "OTsListController"
	});
	$routeProvider.when('/clientes', {
		templateUrl : "pages/listClientes.html",
		controller : "clientController"
	});
	$routeProvider.when('/cuentas', {
		templateUrl : "pages/listCuentas.html",
		controller : "cuentaController"
	});
	$routeProvider.when('/altaCuenta', {
		templateUrl : "pages/altaCuentas.html",
		controller : "cuentaController"
	});
	$routeProvider.when('/altaCliente', {
		templateUrl : "pages/altaCliente.html",
		controller : "clientController"
	});
	$routeProvider.when('/altausuarios', {
		templateUrl : "pages/altausuario.html",
		controller : "userController"
	});
	$routeProvider.when('/modificarusuarios', {
		templateUrl : "pages/modificausuarios.html",
		controller : "userController"
	});
	$routeProvider.when('/altaperfil', {
		templateUrl : "pages/altaPerfil.html",
		controller : "perfilController"
	});
	$routeProvider.when('/modificarperfil', {
		templateUrl : "pages/modificarPerfil.html",
		controller : "controladorListaPerfiles"
	});
	$routeProvider.when('/altaBrocker', {
		templateUrl : "pages/altaBrockers.html",
		controller : "brockersController"
	});
	$routeProvider.when('/listaBrocker', {
		templateUrl : "pages/listaBrockers.html",
		controller : "brockersController"
	});
	$routeProvider.when('/pendientes', {
		templateUrl : "pages/pendienteListClients.html",
		controller : "OTsListController"
	});
	$routeProvider.when('/ListaPendienteA', {
		templateUrl : "pages/operacion.html",
		controller : "OTPendientes"
	});
	$routeProvider.when('/ListaPendienteV', {
		templateUrl : "pages/listaValidados.html",
		controller : "OTPendientes"
	});
	$routeProvider.when('/ordenTrabajo',{
		templateUrl : "pages/ordenTrabajo.html",
		controller : "ordenTrabajoController"
	});
	$routeProvider.when('/ordenTrabajoMod',{
		templateUrl : "pages/ordenTrabajoMod.html",
		controller : "ordenTrabajoController"
	});
	$routeProvider.when('/altaempresa',{
		templateUrl : "pages/altaEmpresa.html",
		controller : "altaempresacontroller"
	});
	$routeProvider.when('/listempresa',{
		templateUrl : "pages/listEmpresa.html",
		controller : "empresacontroller"
	});
	$routeProvider.when('/ot',{
		templateUrl : "pages/OT.html",
		controller : "otcontrol"
	});
	
	$routeProvider.when('/historial_movimientos',{
		templateUrl : "pages/historymov.html",
		controller : "movController"
	});
	$routeProvider.otherwise({
		redirectTo : '/listOTs',
		templateUrl : "pages/listOTs.html",
		controller : "OTsListController"
	});
	
	
}]);

app.factory("userFactory", function(){
	var usuarioFirmado={usuario:"", pass:"",perfil:""};
	
	    var respuesta={
	    	getUsuarioFirmado: function(){
	            return usuarioFirmado;
	        },
	        setUsuarioFirmado: function(user){
	        	usuarioFirmado = user;
	        },
	        getUsuarioPerfil: function(){
	            return usuarioFirmado.perfil;
	        }
	    }
	return respuesta;
});

app.service('sessionService', [
	'$rootScope',
	'$http',
	'$location',
	'$q',
	'userFactory',
	function($rootScope, $http, $location, $q,userFactory) {
		this.authenticate = function(credentials, callback) {

			var headers = credentials ? {
				authorization : "Basic"
						+ btoa(credentials.username + ":"
								+ credentials.password)
			} : {};
			$http.get('user', {
				headers : headers
			}).success(function(data) {
				userFactory.setUsuarioFirmado(data);
				if (data.usuario) {
					$rootScope.authenticated = true;
					$rootScope.variable = true;
					$http.get("/notificacion/numAlertas/"+ data.id).then(function(response){
						$rootScope.numNotificaciones=response.data;
					})
					$location.path("/listaOTs");
				} else {
					$rootScope.authenticated = false;
				}
			}).error(function(data) {
				alert("Usuario o Contraseña incorrectos");
				$location.path("/login");
			});
		}
		this.reset=function(data){
			var d = $q.defer();
			$http.post("/usuario/reset/",data).then(
				function(response) {
					d.resolve(response.data);
				});
			return d.promise;
		}
		this.isAuthenticated = function() {
			var d = $q.defer();
			$http.get("currentSession").success(function(data) {
				$rootScope.authenticated = true;
				d.resolve(data);
			}).error(function(data) {
				$location.path("/login");
			});
			return d.promise;
		}
} ]);

app.controller('navigation', [ 'sessionService','$window', '$rootScope', '$scope','$http', '$location','userFactory',
	function(sessionService, $rootScope, $scope, $http, $location,userFactory) {
		$scope.credentials = {};
		$scope.login = function() {
			sessionService.authenticate($scope.credentials, function() {
				if ($rootScope.authenticated) {
					$scope.error = false;
					$location.path("/");
				} else {
					$location.path("/login");
					$scope.error = true;
				}
			});
		};
	
		$scope.restablecer=function(email){
			sessionService.reset(email).then(function(data){
			
					alert("Correo enviado correctamenta para restablecer su contrase\u00f1a");
					location.reload();
					
		//			setTimeout(window.location.reload.bind(window.location), 1000);
				
			
		});}
} ]);

app.run(['$rootScope','$http','sessionService','userFactory',function ($rootScope,$http,sessionService,userFactory) {
	sessionService.isAuthenticated().then(function(data){
		var us= data;
		userFactory.setUsuarioFirmado(us);
		$rootScope.perfilUsuario=userFactory.getUsuarioPerfil();
		$http.get("/notificacion/numAlertas/"+ us.id).then(function(response){
			$rootScope.numNotificaciones=response.data;
		})
	});
}]);