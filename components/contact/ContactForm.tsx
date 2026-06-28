'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// 폼 유효성 검사 스키마
const contactFormSchema = z.object({
  name: z.string().min(2, '이름은 최소 2글자 이상이어야 합니다'),
  email: z.string().email('유효한 이메일을 입력해주세요'),
  message: z.string().min(10, '메시지는 최소 10글자 이상이어야 합니다')
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  formId: string;
}

export function ContactForm({ formId }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      // Formspree API에 직접 제출
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        toast.success('메시지가 성공적으로 전송되었습니다! 곧 연락드리겠습니다.');
        form.reset();
      } else {
        toast.error('메시지 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('오류가 발생했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* 이름 필드 */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input
                  placeholder='이름을 입력해주세요'
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 이메일 필드 */}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='you@example.com'
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 메시지 필드 */}
        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel>메시지</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='궁금한 점이나 협업 제안을 자유롭게 작성해주세요'
                  className='resize-none'
                  rows={5}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 제출 버튼 - 2026 리디자인 */}
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full h-[52px] rounded-full bg-[#111111] dark:bg-white text-white dark:text-black font-semibold text-base inline-flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity'
        >
          {isSubmitting ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              전송 중...
            </>
          ) : (
            '메시지 전송'
          )}
        </button>
      </form>
    </Form>
  );
}
