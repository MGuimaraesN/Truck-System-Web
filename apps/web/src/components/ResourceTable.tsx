import { Button, Drawer, Form, Input, InputNumber, Select, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/api/client';

interface ResourceTableProps {
  resource: string;
  title: string;
  columns: any[];
  formFields: { name: string; label: string; component?: 'input' | 'number' | 'select'; options?: { label: string; value: any }[] }[];
}

export const ResourceTable = ({ resource, title, columns, formFields }: ResourceTableProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [resource],
    queryFn: async () => {
      const { data } = await api.get(`/${resource}`);
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      await api.post(`/${resource}`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      setOpen(false);
    },
  });

  const mergedColumns = useMemo(() => columns, [columns]);

  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)} style={{ marginBottom: 16 }}>
        Novo registro
      </Button>
      <Table loading={isLoading} columns={mergedColumns} dataSource={data?.data ?? data} rowKey="id" />
      <Drawer title={title} open={open} onClose={() => setOpen(false)} destroyOnClose width={480}>
        <Form layout="vertical" onFinish={(values) => mutation.mutate(values)}>
          {formFields.map((field) => {
            const common = { key: field.name, name: field.name, label: field.label } as const;
            if (field.component === 'number') {
              return (
                <Form.Item {...common} rules={[{ required: true, message: 'Obrigatório' }]}> 
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              );
            }
            if (field.component === 'select') {
              return (
                <Form.Item {...common} rules={[{ required: true, message: 'Obrigatório' }]}> 
                  <Select options={field.options} />
                </Form.Item>
              );
            }
            return (
              <Form.Item {...common} rules={[{ required: true, message: 'Obrigatório' }]}> 
                <Input />
              </Form.Item>
            );
          })}
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Salvar
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};
