import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSlice";
import {
  Container,
  Heading,
  Spacer,
  Button,
  Flex,
  ButtonGroup,
  Text,
} from "@chakra-ui/react";
import TaskInput from "./TodoInput";
import TaskList from "./TodoList";
import { auth } from "../firebase";

const Home = () => {
  const user = useSelector(selectUser);
  return (
    <>
      <Flex p={5} background={"blue.500"} mb={10}>
        <Heading color={"white"} size="xl">
          React-Todo
        </Heading>
        <Spacer />
        {user.uid ? (
          <Flex align="center">
            <Text color="white" mr={5} fontSize="xl">
              {user.displayName} さん
            </Text>
            <Button
              onClick={async () => {
                await auth.signOut();
              }}
            >
              ログアウト
            </Button>
          </Flex>
        ) : (
          <ButtonGroup gap="2">
            <Button
              color="white"
              variant="outline"
              _hover={{ bg: "#FFF", color: "#3182CE" }}
            >
              <Link to={`/login/`}>サインイン</Link>
            </Button>
            <Button
              color="white"
              variant="outline"
              _hover={{ bg: "#FFF", color: "#3182CE" }}
            >
              <Link to={`/login/`}>ログイン</Link>
            </Button>
          </ButtonGroup>
        )}
      </Flex>
      <Container maxW={"7xl"}>
        <TaskInput />
        <Spacer mb={10} />
        <TaskList />
      </Container>
    </>
  );
};

export default Home;
