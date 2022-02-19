import { Text } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

type Props = {
  title: string;
  subtitle: string;
  graphic?: JSX.Element;
};

const TutorialScreen = ({ title, subtitle = '', graphic }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text category="h1">{title}</Text>
      </View>
      {graphic ? (
        <View style={styles.image}>{graphic}</View>
      ) : (
        <View style={styles.noImage}></View>
      )}
      <View style={styles.subtitle}>
        <Text category="s1" style={styles.subtitleText}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

export default TutorialScreen;
const styles = StyleSheet.create({
  title: { flex: 15, justifyContent: 'center', alignItems: 'center' },
  noImage: { flex: 4 },
  image: { flex: 40, justifyContent: 'center', alignItems: 'center' },
  subtitle: { flex: 20, textAlign: 'center' },
  subtitleText: { textAlign: 'center' },
  container: { flex: 1, margin: '5%' },
});
