import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createDeliveryItem } from 'apiSdk/delivery-items';
import { deliveryItemValidationSchema } from 'validationSchema/delivery-items';
import { DeliveryNoteInterface } from 'interfaces/delivery-note';
import { getDeliveryNotes } from 'apiSdk/delivery-notes';
import { DeliveryItemInterface } from 'interfaces/delivery-item';

function DeliveryItemCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: DeliveryItemInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createDeliveryItem(values);
      resetForm();
      router.push('/delivery-items');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<DeliveryItemInterface>({
    initialValues: {
      name: '',
      quantity: 0,
      price: 0,
      weight: 0,
      deadline: new Date(new Date().toDateString()),
      delivery_note_id: (router.query.delivery_note_id as string) ?? null,
    },
    validationSchema: deliveryItemValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Delivery Items',
              link: '/delivery-items',
            },
            {
              label: 'Create Delivery Item',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Delivery Item
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.name}
            label={'Name'}
            props={{
              name: 'name',
              placeholder: 'Name',
              value: formik.values?.name,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Quantity"
            formControlProps={{
              id: 'quantity',
              isInvalid: !!formik.errors?.quantity,
            }}
            name="quantity"
            error={formik.errors?.quantity}
            value={formik.values?.quantity}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('quantity', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Price"
            formControlProps={{
              id: 'price',
              isInvalid: !!formik.errors?.price,
            }}
            name="price"
            error={formik.errors?.price}
            value={formik.values?.price}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('price', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Weight"
            formControlProps={{
              id: 'weight',
              isInvalid: !!formik.errors?.weight,
            }}
            name="weight"
            error={formik.errors?.weight}
            value={formik.values?.weight}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('weight', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl id="deadline" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Deadline
            </FormLabel>
            <DatePicker
              selected={formik.values?.deadline ? new Date(formik.values?.deadline) : null}
              onChange={(value: Date) => formik.setFieldValue('deadline', value)}
            />
          </FormControl>
          <AsyncSelect<DeliveryNoteInterface>
            formik={formik}
            name={'delivery_note_id'}
            label={'Select Delivery Note'}
            placeholder={'Select Delivery Note'}
            fetcher={getDeliveryNotes}
            labelField={'note_number'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/delivery-items')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'delivery_item',
    operation: AccessOperationEnum.CREATE,
  }),
)(DeliveryItemCreatePage);
