import { useState, useCallback } from 'react';
import { Alert, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Header } from '@components/Header';
import { ListEmpty } from '@components/ListEmpty';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { Button } from '@components/Button';

import { Container } from './styles';
import { groupsGetAll } from '@storage/group/groupsGetAll';
import { Loading } from '@components/Loading';

export function Groups() {
  const [groups, setGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate('new');
  };

  async function fetchGroups() {
    try {
      setIsLoading(true)

      const data = await groupsGetAll();

      setGroups(data)


    } catch (error) {
      console.log(error);
      Alert.alert('Turmas', 'Não foi possivel carregar as turma')
    } finally {
      setIsLoading(false)
    }
  }


  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group });
  }


  useFocusEffect(useCallback(() => {
    fetchGroups();
  }, []))


  return (
    <Container>
      <Header />

      <Highlight
        title='Turmas'
        subtitle='Jogue com a sua turma'
      />


      {
        isLoading ? <Loading /> :

          <FlatList
            data={groups}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <GroupCard
                title={item}
                onPress={() => handleOpenGroup(item)}
              />

            )}

            contentContainerStyle={groups.length === 0 && { flex: 1 }}
            ListEmptyComponent={() => (
              <ListEmpty
                message="Que tal cadastrar uma turma"

              />
            )}
            showsVerticalScrollIndicator={false}
          />
      }



      <Button
        title='Crie uma nova turma'
        onPress={handleNewGroup}
      />
    </Container>
  );
}