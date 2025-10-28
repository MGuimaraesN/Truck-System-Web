import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, InputNumber, Select, Table, type FormItemProps, type FormProps } from 'antd';
import type { Rule } from 'antd/es/form';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import { api } from '@/api/client';
import type { components } from '@/api/generated';

export type PaginatedResponse<TItem> = {
  data: TItem[];
  pagination: components['schemas']['Pagination'];
};

export type FormField<TForm extends Record<string, unknown>> = {
  name: FormItemProps<TForm>['name'];
  label: string;
  component?: 'input' | 'number' | 'select';
  options?: { label: string; value: string | number | boolean }[];
  rules?: Rule[];
  required?: boolean;
};

interface ResourceTableProps<
  TItem extends { id: number },
  TForm extends Record<string, unknown> = Record<string, unknown>
> {
  resource: string;
  title: string;
  columns: ColumnsType<TItem>;
  formFields: FormField<TForm>[];
}

export const ResourceTable = <
  TItem extends { id: number },
  TForm extends Record<string, unknown> = Record<string, unknown>
>({
  resource,
  title,
  columns,
  formFields,
}: ResourceTableProps<TItem, TForm>) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<TForm>();

  const { data, isLoading } = useQuery<PaginatedResponse<TItem>>({
    queryKey: [resource],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<TItem>>(`/${resource}`);
      return data;
    },
  });

  const mutation = useMutation<void, unknown, TForm>({
    mutationFn: async (values: TForm) => {
      await api.post(`/${resource}`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      form.resetFields();
      setOpen(false);
    },
  });

  const rows = Array.isArray(data?.data) ? data?.data : [];
  const handleFinish: FormProps<TForm>['onFinish'] = (values) => {
    mutation.mutate(values);
  };

  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)} style={{ marginBottom: 16 }}>
        Novo registro
      </Button>
      <Table<TItem> loading={isLoading} columns={columns} dataSource={rows} rowKey="id" />
      <Drawer title={title} open={open} onClose={() => setOpen(false)} destroyOnClose width={480}>
        <Form<TForm> layout="vertical" form={form} onFinish={handleFinish} preserve={false}>
          {formFields.map((field) => {
            const rules = field.rules ?? (field.required ? [{ required: true, message: `${field.label} é obrigatório` }] : undefined);
            const common: FormItemProps<TForm> = {
              name: field.name,
              label: field.label,
              rules,
            };
            const key = Array.isArray(field.name) ? field.name.join('.') : String(field.name);
            if (field.component === 'number') {
              return (
                <Form.Item<TForm> key={key} {...common}>
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              );
            }
            if (field.component === 'select') {
              return (
                <Form.Item<TForm> key={key} {...common}>
                  <Select options={field.options} />
                </Form.Item>
              );
            }
            return (
              <Form.Item<TForm> key={key} {...common}>
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
