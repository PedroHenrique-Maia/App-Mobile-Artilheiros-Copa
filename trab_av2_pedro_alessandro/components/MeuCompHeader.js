import { StyleSheet, View, Text } from 'react-native';

function MeuCompHeader(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{props.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItens: 'center',
  },
  headerText: {
    marginTop: 10,
    marginLeft: 10, 
    marginRight: 10,
    marginBottom: 10,
    height: 30,
    backgroundColor: "#800000",
    color: "white",
    borderRadius: 10,
    fontSize: 20,
    textAlign: 'center',
    alignItems: 'center',
  },
});
export default MeuCompHeader;
