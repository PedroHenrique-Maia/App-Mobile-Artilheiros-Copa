import { useEffect, useState } from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator} from 'react-native';
import Picker from 'react-native-picker-select';
// Importando um componente gerado nesse projeto. Não é necessário acrescentar o .js na indicação do arquivo
import MeuCompHeader from '../components/MeuCompHeader';
import logo from '../assets/logo.png';

function Form({ navigation, route }) {
  // route.params é um map que dá todos os dados repassados pela página que efetuou a chamada
  const [operacao] = useState(route.params.operacao);
  const [id] = useState(operacao !== 'incluir'? route.params.id : '');
  const [nome, setNome] = useState(null);
  const [idade, setIdade] = useState(null);
  const [idCidade, setIdCidade] = useState(0);
  const [listaCidades, setListaCidades] = useState([]);
  const [isLoading, setLoading] = useState(false);
  
  const placeholder = {
    label: 'Selecione o Pais:',
    value: null,
    color: 'darkgray',
  };

  //-------------------------------------------------------------
  // alterarCidades
  //-------------------------------------------------------------
  
  const obterCidades = async () => {
     try {
      console.log("Obter Cidades");
      setLoading(true);
      const response = await fetch('https://trab-av2-server.glitch.me/cidades',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }});
      const cidades = await response.json();
      let lista = [];
      // Adaptando o JSON para label/value do Picker
      cidades.forEach((cidade, i) => 
        lista.push({'label': cidade.nome, 'value': cidade.id})
      );
      setListaCidades(lista);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  //-------------------------------------------------------------
  // obterAluno
  //-------------------------------------------------------------
  
const obterAluno = async (idAluno) => {
  try {
    // recuperei o id pelo route.params.id colocado acima
    if(idAluno == 0)
      return;
    setLoading(true);
    const response = await fetch('https://trab-av2-server.glitch.me/aluno/' + idAluno ,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
    }});
    const json = await response.json();
    setNome(json.Nome);
    setIdade(json.Idade);
    setIdCidade(json.IdCidade);
    evtCidadeAlterada(idCidade);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

//-------------------------------------------------------------
// incluirAluno
//-------------------------------------------------------------
  
const incluirAluno = async () => {
  try {
      setLoading(true);
      console.log('-> https://trab-av2-server.glitch.me/incluir/' + nome +  '/' + idade + '/' + idCidade);
      const response = await fetch('https://trab-av2-server.glitch.me/aluno/incluir/' + nome +  '/' + idade + '/' + idCidade, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }});
      console.log("-->" + response);
      const json = await response.json();
      console.log("-->" + JSON.stringify(json));
      await navigation.goBack();
   } catch (error) {
      console.log("erro:" + error);
    } finally {
      setLoading(false);
    }
  }

//-------------------------------------------------------------
// alterarAluno
//-------------------------------------------------------------
  
  const alterarAluno = async () => {
     try {
      setLoading(true);
      console.log('-> https://trab-av2-server.glitch.me/aluno/alterar/' + id + '/' + nome +  '/' + idade + '/' + idCidade);
     const response = await fetch('https://trab-av2-server.glitch.me/aluno/alterar/' + id +  '/' + nome +  '/' + idade + '/' + idCidade, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }});
      console.log("-->" + response);
      const json = await response.json();
      console.log("-->" + JSON.stringify(json));
      await navigation.goBack();
   } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

//-------------------------------------------------------------
// useEffect
//-------------------------------------------------------------
  useEffect(() => {
    console.log("UseEffect");
    obterCidades();
    if(operacao === 'alterar')
      obterAluno(id);
  }, [navigation]);

  // Tratamento dos eventos de alteração do formulário
  function evtNomeAlterado(n) {
    setNome(n);
  }
  function evtIdadeAlterada(i) {
    setIdade(parseInt(i));
  }
  function evtCidadeAlterada(c) {
    console.log("idCidade = " + c);
    setIdCidade(c);
  }
  function voltar() {
    navigation.goBack();
  }

//-------------------------------------------------------------
// RETORNO DA PÁGINA
//-------------------------------------------------------------

  return (
    <>
  <MeuCompHeader title="Cadastro de Artilheiros" />
      <View style={styles.container}>
        <Image source={logo} style={styles.topImage} />
        <Text style={styles.title}>Formuário</Text>
        <TextInput
          name="nome"
          style={styles.input}
          placeholder="Jogador:"
          onChangeText={evtNomeAlterado}
          value={nome}
        />
        <TextInput
          name="idade"
          style={styles.input}
          placeholder="Gols:"
          keyboardType={'numeric'}
          onChangeText={evtIdadeAlterada}
          value={idade}
        />
        <Picker
          name="idCidade"
          selectedValue={idCidade}
          placeholder={placeholder}
          onValueChange={evtCidadeAlterada}
          style={pickerSelectStyles}
          items={listaCidades}
        />
        <TouchableOpacity style={styles.button} onPress={operacao === 'incluir' ? incluirAluno : alterarAluno}>
          <Text style={styles.buttonText}> Salvar </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={voltar}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
       {isLoading ? <ActivityIndicator/> : ""}
     </View>
    </>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    marginTop: 10,
    height: 40,
    backgroundColor: '#800000',
    borderRadius: 10,
    fontSize: 16,
    padding: 5,
    alignItems: 'stretch',
    alignSelf: 'center',
    width: 300
  },
  inputAndroid: {
    marginTop: 10,
    height: 40,
    backgroundColor: '#800000',
    borderRadius: 10,
    fontSize: 16,
    padding: 5,
    alignItems: 'stretch',
    alignSelf: 'center',
    width: 300
  },
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  inputContainer: {
    alignItems: 'stretch',
  },
  topImage: {
    margin: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: "#800000"
  },
  input: {
    marginTop: 10,
    height: 40,
    backgroundColor: '#800000',
    color: "white",
    borderRadius: 10,
    fontSize: 16,
    padding: 5,
    width: 300
  },
  button: {
    marginTop: 10,
    height: 40,
    backgroundColor: '#800000',
    borderRadius: 10,
    paddingHorizontal: 24,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: "white",
    fontWeight: 'bold',
  },
});
export default Form;
