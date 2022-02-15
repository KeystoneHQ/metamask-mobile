import React, { useState, Fragment, useMemo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Engine from '../../../../core/Engine';
import AnimatedQRScannerModal from '../../ConnectQRHardware/AnimatedQRScanner';
import AnimatedQRCode from './AnimatedQRCode';

interface IConnectQRHardwareProps {
	navigation: any;
	route: any;
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		paddingHorizontal: 32,
		paddingTop: 16,
	},
});

const QRHardwareSigner = ({ navigation, route }: IConnectQRHardwareProps) => {
	const KeyringController = useMemo(() => {
		const { KeyringController: keyring } = Engine.context as any;
		return keyring;
	}, []);
	const QRState = route.params?.QRState;
	const [scannerVisible, setScannerVisible] = useState(false);
	const showScanner = useCallback(() => {
		setScannerVisible(true);
	}, []);
	const hideScanner = useCallback(() => {
		setScannerVisible(false);
	}, []);

	const onScanSuccess = useCallback(
		(ur: string) => {
			hideScanner();
			// eslint-disable-next-line no-console
			console.log(ur);
			KeyringController.submitQRHardwareSignature(QRState.sign.request?.requestId, ur);
			navigation.goBack();
		},
		[KeyringController, QRState.sign.request?.requestId, hideScanner, navigation]
	);
	const onScanError = useCallback(
		(error: string) => {
			hideScanner();
			// eslint-disable-next-line no-console
			console.log(error);
		},
		[hideScanner]
	);

	return (
		<Fragment>
			<View style={styles.container}>
				{QRState?.sign?.request && (
					<View>
						<AnimatedQRCode
							cbor={QRState.sign.request.payload.cbor}
							type={QRState.sign.request.payload.type}
						/>
						<TouchableOpacity onPress={showScanner}>
							<Text>send</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
			<AnimatedQRScannerModal
				visible={scannerVisible}
				purpose={'sign'}
				onScanSuccess={onScanSuccess}
				onScanError={onScanError}
				hideModal={hideScanner}
			/>
		</Fragment>
	);
};

QRHardwareSigner.navigationOptions = ({ navigation, route }: IConnectQRHardwareProps) =>
	getSendFlowTitle('send.sign', navigation, route);

export default QRHardwareSigner;
