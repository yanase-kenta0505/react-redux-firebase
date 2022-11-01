import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/user/userSlice";
import { auth } from "../firebase";
import {
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
} from "@chakra-ui/react";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [resetEmail, setResetEmail] = useState("");

  const singInEmail = async () => {
    const authUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (authUser.user) {
      await updateProfile(authUser.user, {
        displayName: username,
      });
    }
    dispatch(updateUserProfile({ displayName: username }));
  };
  const loginEmail = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const sendResetEmail = async () => {
    await sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        onClose();
        setResetEmail("");
      })
      .catch((err) => {
        alert(err.message);
        setResetEmail("");
      });
  };
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} minW={"500px"} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>
            {isLogin ? "ログイン" : "ユーザー登録"}
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          {!isLogin && (
            <FormControl id="username">
              <FormLabel>ユーザー名</FormLabel>
              <Input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
                value={username}
              />
            </FormControl>
          )}
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>メールアドレス</FormLabel>
              <Input
                type="email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                value={email}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>パスワード</FormLabel>
              <Input
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                value={password}
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Link color={"blue.400"} onClick={onOpen}>
                  パスワードを忘れましたか？
                </Link>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>パスワードを忘れましたか？</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Text>登録したメールアドレスを入力してください</Text>
                      <Input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button mr={3} colorScheme="red" onClick={onClose}>
                        閉じる
                      </Button>
                      <Button colorScheme="blue" onClick={sendResetEmail}>
                        送信
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Link color={"blue.400"} onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "ユーザー登録" : "ログイン画面へ戻る"}
                </Link>
              </Stack>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={
                  isLogin
                    ? async () => {
                        try {
                          await loginEmail();
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }
                    : async () => {
                        try {
                          await singInEmail();
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }
                }
              >
                ログイン
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
