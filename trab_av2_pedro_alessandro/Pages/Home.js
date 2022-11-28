// Importando os hooks useEffect e useState. Por definição, um Hook é um componente que te permite utilizar 
// recursos do React
import { useEffect, useState, BackHandler } from 'react';

// Importando os componentes utilizados nessa página
import { ActivityIndicator, StyleSheet, FlatList, StatusBar, Text, View, TouchableOpacity} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';

// Importando a função que descreve como foi definida a navegação da aplicação
import { useNavigation } from '@react-navigation/native';

// Lodash (acessado usando-se o underscore) nos dá uma série de funções utilitárias para manipulação
// de: Array,Collection, Date, Function, String, entre outras classes.
import _ from 'lodash';

function Home() {
  // Recuperando o componente de navegação da aplicação
  const navigation = useNavigation();
  // O hook useState define um componente Wrapper com o atributo interno 'state'. Ele nos traz uma série de
  // vantagens: (1) a referência para o componente é 'const', mas o objeto internamente é mutável através do
  // uso da função associada na declaração. 
  // (2) Se o componente é utilizado em algum ponto da página e se ele troca o seu 'state', automaticamente
  // as partes que a página referenciam o componente são alteradas, funcionando como se fosse uma callback. 
  const [carregarPagina,setCarregarPagina] = useState(true);
  // Hook para colocar o ícone animado de carga na página (quando se busca os dados de aluno com fetch)
  const [isLoading, setLoading] = useState(false);
  // Hook para guardar os alunos a serem apresentados. 
  const [alunos, setAlunos] = useState([]);
  // Hook para indicar as colunas da FlatList (tabela)
  const [ colunas ] = useState([
    {nome:" ",tam:'10%'},
    {nome:"Id",tam:'15%'},
    {nome:"Jogador",tam:'40%'},
    {nome:"Gols",tam:'15%'},
    {nome:"Pais",tam:'20%'}]);
  // Hook para indicar qual é o sentido de ordenação a ser empregado
  const [ direcao, setDirecao ] = useState('desc');
  // Hook para indicar qual é a coluna selecionada como padrão de ordenação
  const [ colunaSelecionada, setColunaSelecionada ] = useState("Id");
  // Hook para indicar qual é o registro que está selecionado
  const [ regSelecionado, setRegSelecionado ] = useState(null);

  //-------------------------------------------------------------------------
  // ObterAlunos: função para efetuar a carga dos alunos através do servidor
  //-------------------------------------------------------------------------
  const obterAlunos = async () => {
     try {
       // Coloco o ícone animado de ação de carga
      setLoading(true);
      // Realizo um fetch de dados do servidor
      const response = await fetch('https://trab-av2-server.glitch.me/alunos',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }});
      // Atualizo a lista de alunos
      setAlunos(await response.json());
    } catch (error) {
      console.error(error);
    } finally {
      // Retiro o ícone animado de ação de carga
      setLoading(false);
    }
  }

  //------------------------------------------------------------------------
  // ExcluirAluno: função para efetuar a exclusão do registro selecionado 
  //------------------------------------------------------------------------
  const excluirAluno = async () => {
     try {
      // Se nenhum registro foi selecionado, sai da função
      if(regSelecionado == null)
        return;
      setLoading(true);
      const response = await fetch('https://trab-av2-server.glitch.me/aluno/excluir/' + regSelecionado,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json; charset=utf-8'
        }
      });
      // Espero a resposta que indica que a operação de exclusão foi efetuada
      await response.json();
      // Realizo novamente a carga de alunos
      await obterAlunos();
      // Desmarco todos os radio buttons
      setRegSelecionado(null);
    } catch (error) {
      console.error("ERRO: " + error);
    } finally {
       // Retiro o ícone animado de ação de carga
     setLoading(false);
    }
  }

  //----------------------------------------------------------------
  // SortTable: função chamada para efetuar a ordenação na FlatList
  //----------------------------------------------------------------
  const sortTable = (coluna) => {
    // Vejo qual é o valor que está no Hook de direção para saber o sentido da ordenação
    const novaDirecao = direcao === "desc" ? "asc" : "desc";
    // Utilizando a função orderBy da LoDash
    const sortedData = _.orderBy(alunos, coluna, novaDirecao);
    // Determino qual é a coluna selecionada
    setColunaSelecionada(coluna);
    // Determino qual é a direção que foi empregada 
    setDirecao(novaDirecao);
    // Atualizo a lista de alunos, agora ordenada
    setAlunos(sortedData);
  }

  //-------------------------------------------------------------------------
  // useEffect: função que é executada toda vez que a página for renderizada ou
  // que os objetos na lista indicada ao final mudarem de estado
  //------------------------------------------------------------------------
  useEffect(() => {
    // carregando os alunos
    obterAlunos();
    // Definindo a callback do evento focus na navegação
    navigation.addListener('focus', () => setCarregarPagina(!carregarPagina));
  }, [carregarPagina,navigation]);

  //-------------------------------------------------------------
  // tableHeader
  //-------------------------------------------------------------
  const tableHeader = () => (
    <View style={styles.tableHeader}>
      {
        colunas.map((coluna, index) => {
          {
            { /*** TouchableOpacity define uma área sensível ao toque e que fica opaca durante o toque ***/ }
            return (
              <TouchableOpacity key={index} style={{...styles.columnHeader,width:coluna.tam}} onPress={()=> sortTable(coluna.nome)}>
                <Text style={styles.columnHeaderTxt}> 
                  {coluna.nome + " "} 
                  {colunaSelecionada === coluna.nome && 
                    <MaterialCommunityIcons name={direcao === "desc" ? "arrow-down-drop-circle" : "arrow-up-drop-circle"} />
                  }
                </Text>
              </TouchableOpacity>
            )
          }
        })
      }
    </View>
  );

//-------------------------------------------------------------
// RETORNO DA PÁGINA
//-------------------------------------------------------------
return (
    <View style={[styles.container, {width:"96%"}]}>
      <FlatList 
        data={alunos} 
        style={{width:"100%"}} 
        keyExtractor={(item, index) => index+""}
        ListHeaderComponent={tableHeader}
        stickyHeaderIndices={[0]}
        renderItem={({item, index})=> {
            return (
              <View style={index % 2 == 1 ? styles.tableRowBlue : styles.tableRow}>
                <RadioButton style={{...styles.columnRowTxt,width:'10%'}} value={item.Id}
                  status={ regSelecionado === item.Id ? 'checked' : 'unchecked' }
                  onPress={(value) => {setRegSelecionado(item.Id)}} />
                <Text style={{...styles.columnRowTxt,width:'15%'}}>{item.Id}</Text>
                <Text style={{...styles.columnRowTxt,width:'40%'}}>{item.Nome}</Text>
                <Text style={{...styles.columnRowTxt,width:'15%'}}>{item.Idade}</Text>
                <Text style={{...styles.columnRowTxt,width:'20%'}}>{item.Cidade}</Text>
              </View>
            )
        }}
      />
      <Text style={styles.tableBottom}></Text>
      {isLoading ? <ActivityIndicator/> : ""}
      <StatusBar style={styles.tableBottom}/>
      { /**** navigation.navigate executa uma navegação para a página com o nome indicado. ****/ }
      { /**** o segundo parâmetro são dados a serem repassados à página ****/ }
      <TouchableOpacity
        style={styles.button}
        onPress={() => {navigation.navigate('Form',{operacao:'incluir'});} }>
        <Text style={styles.buttonText}>Incluir</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if(regSelecionado == null)
            alert("Nenhum item selecionado");
          else
            navigation.navigate('Form',{operacao:'alterar',id: regSelecionado})}}>
      <Text style={styles.buttonText}>Alterar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => excluirAluno() }>
        <Text style={styles.buttonText}>Excluir</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => BackHandler.exitApp() }>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf : 'center'
  },
  tableHeader: {
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#800000",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    height: 50
  },
  tableBottom: {
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#800000",
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    height: 20,
    alignSelf: 'stretch',
    paddingTop:10
  },
  columnHeader: {
    textAlign: "center",
    alignItems:"center"
  },
  columnHeaderTxt: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  tableRowBlue: {
    textAlign: "center",
    backgroundColor: "#F0FBFC",
    flexDirection: "row",
    height: 40,
    alignItems:"center",
  },
  tableRow: {
    textAlign: "center",
    flexDirection: "row",
    height: 40,
    alignItems:"center",
  },
  columnRowTxt: {
    textAlign: "center",
    justifyContent: "center",
    
  },
  button: {
    marginTop: 5,
    height: 30,
    width: 250,
    backgroundColor: "#800000",
    borderRadius: 5,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  }
});
export default Home;

