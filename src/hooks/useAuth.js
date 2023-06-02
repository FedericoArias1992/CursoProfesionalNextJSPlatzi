import React, {useState, useContext, createContext} from 'react';
import Cookie from 'js-cookie'; //Nos ayuda asignar a nuestro navegador las cookies que esté recibiendo en el momento de la autenticación
import axios from 'axios'; //Para el manejo de las peticiones como GET, PUT, POST, DELETE
import endPoints from '../services/api/index';

//console.log(endPoints.auth.login) validamos que importamos bien las env.local variables

const AuthContext = createContext(); //Se crea un nuevo context gracias a la api de react
//Se crea la encapsulación de nuestra aplicación
export function ProviderAuth({children}){   //El componente ProviderAuth se exporta y se utiliza como un proveedor de contexto. Toma un prop children que representa los componentes hijos a los que se les proporcionará el contexto.
	const auth = useProvideAuth();      //se utiliza el Custom Hook useProvideAuth para obtener el estado de autenticación (user) y la función de inicio de sesión (signIn).
	return <AuthContext.Provider value ={auth}>{children}</AuthContext.Provider>;
}           //El componente AuthContext.Provider envuelve los componentes hijos y proporciona el valor del contexto (auth) a través del atributo value.

export const useAuth = () => {  //El Custom Hook useAuth se exporta para que los componentes hijos puedan acceder 
	return useContext(AuthContext); //al contexto de autenticación. Este Custom Hook utiliza el useContext de la API de React para obtener el valor del contexto AuthContext.
};
//Captar la información del usuario
function useProvideAuth() {     //El Custom Hook useProvideAuth implementa la lógica de autenticación y devuelve un objeto que contiene el estado de usuario (user) y la función de inicio de sesión (signIn). 
	const [user, setUser] = useState(null); //En este ejemplo, la función signIn simplemente establece el estado de usuario en "login".

	const signIn = async (email, password) => {
		const options = {
			headers: {
			  accept: '*/*',
			  'Content-Type': 'application/json',
			},
		  };
			const { data: access_token } = await axios.post(endPoints.auth.login, { email, password }, options);
		  	//esa línea nos permite leer un access token que nos devuelve el servidor tal que cuando la autenticacion sea
			// correcta, guardar ese access token en una cookie para que nos mantenga la sesion inicializada.
			//endoPoints.auth.login esa en src/services/api y contiene los puntos de entrada de cada ruta de conexion a la API
			// email y password son las variables a validar.
			//options es un parámetro que debemos construir e hicimos arriba!

		  	//asignamos una cookie a la sesion
			  if(access_token){
				const token = access_token.access_token; //requerido para el acceso a la información
				console.log(token);
				Cookie.set('token', token, {expires: 5});
				//expires permite que después de un tiempo definido podamos eliminar la información almacenada y la app nos pida logear de nuevo
				// -> session/cookie expired 
				console.log(access_token);	//para mostrar por consola si obtuvimos correctamente la AccessTocken
				//Se envía la información necesaria para que pueda definir el valor por defecto
				axios.defaults.headers.Authorization = `Bearer ${token}`;
				//Vamos a llamar el recurso con el profile - ya hicimos login, ahora asignamos el profile para la sesion
				const {data: user} = await axios.get(endPoints.auth.profile);
				console.log(user);
				setUser(user);	//definimos el usuario para la sesion
			}
		};
	  
		return {
		  user,
		  signIn,
		};
	  }