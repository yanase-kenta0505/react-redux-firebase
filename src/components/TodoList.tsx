import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Todos } from "../features/todo/todosSlice";
import { selectUser } from "../features/user/userSlice";
import { db, auth } from "../firebase";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  Heading,
  Button,
  ButtonGroup,
  HStack,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
} from "@chakra-ui/react";
import Todo from "./Todo";

const TaskList: React.FC = () => {
  const user = useSelector(selectUser);
  const storeTodos = useSelector(Todos);
  const [todos, setTodos] = useState([
    {
      id: "",
      uid: "",
      title: "",
      date: null,
      detail: "",
      status: "",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [filterdTodos, setFilterdTodos] = useState(todos);
  const statusList = [
    { value: "all", label: "すべて", color: "gray" },
    { value: "no-yet", label: "未着手", color: "red" },
    { value: "start", label: "着手", color: "orange" },
    { value: "comp", label: "完了", color: "green" },
  ];
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setLoading(false);
      } else {
        setLoading(true);
      }
    });
  }, []);

  useEffect(() => {
    if (loading) {
      setTodos(storeTodos);
    } else {
      const q = query(collection(db, "todos"), where("uid", "==", user.uid));
      onSnapshot(q, (snapshot) => {
        setTodos(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            uid: doc.data().uid,
            title: doc.data().title,
            date: doc.data().date,
            detail: doc.data().detail,
            status: doc.data().status,
          }))
        );
      });
    }
  }, [loading, storeTodos]);
  useEffect(() => {
    const filteringTodos = () => {
      switch (filter) {
        case "all":
          setFilterdTodos(todos);
          break;
        default:
          setFilterdTodos(todos.filter((todo) => todo.status === filter));
          break;
      }
    };
    filteringTodos();
  }, [filter, todos]);
  return (
    <>
      <Heading as="h3" size="lg" mb={5} textAlign={"center"}>
        タスク一覧
      </Heading>
      <ButtonGroup mx={"auto"} w="100%" mb={8}>
        <HStack justify="center" w="100%">
          {statusList.map((status) => {
            return (
              <Button
                value={status.value}
                onClick={() => setFilter(status.value)}
                key={status.value}
                colorScheme={status.color}
                px={10}
                variant={status.value === filter ? "solid" : "outline"}
              >
                {status.label}
              </Button>
            );
          })}
        </HStack>
      </ButtonGroup>
      <TableContainer whiteSpace="break-spaces">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>タスク名</Th>
              <Th>完了予定日</Th>
              <Th>詳細</Th>
              <Th>ステータス</Th>
              <Th></Th>
            </Tr>
          </Thead>
          {filterdTodos[0]?.title && (
            <>
              <Tbody>
                {filterdTodos.map((todo, index: number) => (
                  <Todo
                    index={index}
                    id={todo.id}
                    key={todo.id}
                    uid={todo.uid}
                    title={todo.title}
                    date={todo.date}
                    detail={todo.detail}
                    status={todo.status}
                  />
                ))}
              </Tbody>
            </>
          )}
        </Table>
      </TableContainer>
    </>
  );
};

export default TaskList;

{
  /* <Todo
// id={todo.id}
// uid={todo.uid}
// title={todo.title}
// date={todo.date}
// detail={todo.detail}
// status={todo.status}
/>; */
}

{
  /* <Todo
id=""
uid=""
title="test"
date="2021/1/1"
detail=""
status={todos[0]?.status ? todos[0].status : "yet"}
/> */
}
