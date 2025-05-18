
import {
  Button,
  Popover,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react"

const SelectWithinPopover = ({onChange}) => {
  return (
    <Popover.Root size="xs"  closeOnSelect={true}>
      <Popover.Trigger asChild>
        <Button variant="outline" size="sm">
          Create a Room
        </Button>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Header>Create a public or private room</Popover.Header>
            <Popover.Body>
              <Select.Root
                collection={privacy_settings}
                size="sm"
                positioning={{ sameWidth: true, placement: "bottom" }}
                onValueChange={onChange}
                closeOnSelect={true}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Privacy Setting" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content width="full">
                    {privacy_settings.items.map((item) => (
                      <Select.Item item={item} key={item.value}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}

const privacy_settings = createListCollection({
  items: [
    { label: "Public", value: false },
    { label: "Private", value: true },
  ],
})

export default SelectWithinPopover
