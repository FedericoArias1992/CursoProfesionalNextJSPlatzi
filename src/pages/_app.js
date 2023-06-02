import MainLayout from '../layout/MainLayout';
import '@styles/tailwind.css';
import { ProviderAuth } from '@hooks/useAuth';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<ProviderAuth>
				<MainLayout>
					<Component {...pageProps} />	{/*el elemento que esté dentro de MainLayout estará encapsulado*/}
				</MainLayout>				{/*dentro del mismo*/}
			</ProviderAuth>
		</>
	);
}
export default MyApp;
