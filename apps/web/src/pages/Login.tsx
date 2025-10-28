import { Button, Card, Form, Input, Typography } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/client';
import { useAuthStore } from '@/store/auth';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  const mutation = useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      const { data } = await api.post('/auth/login', values);
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
        <Form layout="vertical" onFinish={(values) => mutation.mutate(values)}>
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
