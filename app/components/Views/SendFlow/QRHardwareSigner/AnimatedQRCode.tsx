import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { View } from 'react-native';
import { UR, UREncoder } from '@ngraveio/bc-ur';

interface IAnimatedQRCodeProps {
	cbor: string;
	type: string;
}

const AnimatedQRCode = ({ cbor, type }: IAnimatedQRCodeProps) => {
	const urEncoder = useMemo(() => new UREncoder(new UR(Buffer.from(cbor, 'hex'), type), 400), [cbor, type]);
	const [currentQRCode, setCurrentQRCode] = useState(urEncoder.nextPart());
	useEffect(() => {
		const id = setInterval(() => {
			setCurrentQRCode(urEncoder.nextPart());
		}, 100);
		return () => {
			clearInterval(id);
		};
	}, [urEncoder]);
	return (
		<View>
			<QRCode value={currentQRCode.toUpperCase()} size={250} />
		</View>
	);
};

export default AnimatedQRCode;
