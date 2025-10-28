import { useMutation } from '@tanstack/react-query';
import { Button, Card, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/client';
import type { components } from '@/api/generated';
import { useAuthStore } from '@/store/auth';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  type Credentials = components['schemas']['LoginRequest'];
  type AuthTokens = components['schemas']['AuthTokens'];

  const mutation = useMutation<AuthTokens, unknown, Credentials>({
    mutationFn: async (values) => {
      const { data } = await api.post<AuthTokens>('/auth/login', values);
      return data;
    },
    onSuccess: (data) => {
      setCredentials(data);
      navigate('/');
    },
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card style={{ width: 360 }}>
        <Title level={3}>Frota Sapiens</Title>
        <Form<Credentials> layout="vertical" onFinish={(values) => mutation.mutate(values)}>
          <Form.Item name="email" label="E-mail" rules={[{ required: true, message: 'Informe seu e-mail' }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item name="password" label="Senha" rules={[{ required: true, message: 'Informe sua senha' }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
            Entrar
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
