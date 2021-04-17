import { Card, Modal, Text } from '@ui-kitten/components';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getShareLink } from '../utils/experience';

const { width } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onBackdropPress: () => void;
  slug: string;
};

const QRModal = ({ visible, onBackdropPress, slug }: Props) => {
  return (
    <Modal
      visible={visible}
      onBackdropPress={onBackdropPress}
      backdropStyle={styles.backdrop}
    >
      <Card
        header={(props) => (
          <View {...props}>
            <Text category="s1">Point another iPhone camera at this!</Text>
          </View>
        )}
        footer={(props) => (
          <View {...props}>
            <Text category="s2">Tap outside to dismiss</Text>
          </View>
        )}
      >
        <View style={styles.qrCardBody}>
          <QRCode value={getShareLink(slug)} size={Math.floor(width * 0.7)} />
        </View>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  qrCardBody: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
});

export default QRModal;
