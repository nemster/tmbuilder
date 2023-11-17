<script lang="ts">
  import { onMount } from "svelte";
  import {
    add_fungible_to_account,
    add_non_fungible_to_account,
    fungibles_in_worktop,
    non_fungibles_in_worktop,
    remove_fungible_from_worktop,
    remove_non_fungible_from_worktop,
  } from "../../content";

  onMount(() => {
    document
      .querySelector<HTMLInputElement>("#worktop2")!
      .addEventListener("change", function () {
        document.querySelector<HTMLInputElement>("#all2")!.disabled =
          this.checked;
        document.querySelector<HTMLInputElement>("#quantity2")!.disabled =
          this.checked ||
          document.querySelector<HTMLInputElement>("#all2")!.checked;
        document.querySelector<HTMLSelectElement>("#fungible2")!.disabled =
          this.checked;
        document.querySelector<HTMLSelectElement>("#non_fungible2")!.disabled =
          this.checked;
        if (this.checked) {
          document.querySelector<HTMLInputElement>("#all2")!.checked = true;
          document.querySelector<HTMLInputElement>("#quantity2")!.value = "";
          document.querySelector<HTMLSelectElement>(
            "#fungible2"
          )!.selectedIndex = 0;
          document.querySelector<HTMLSelectElement>(
            "#non_fungible2"
          )!.selectedIndex = 0;
        }
      });

    document
      .querySelector<HTMLInputElement>("#all2")!
      .addEventListener("change", function () {
        const quantity2 =
          document.querySelector<HTMLInputElement>("#quantity2");
        if (
          this.checked ||
          document.querySelector<HTMLInputElement>("#worktop2")!.checked
        ) {
          quantity2!.disabled = true;
          quantity2!.value = "";
        } else {
          quantity2!.disabled = false;
          const fungible2 =
            document.querySelector<HTMLSelectElement>("#fungible2")!.value;
          if (fungible2 != "") {
            quantity2!.value = String(fungibles_in_worktop[fungible2]);
          }
        }
      });
  });

  document
    .querySelector<HTMLSelectElement>("#fungible2")!
    .addEventListener("change", function () {
      const all2 = document.querySelector<HTMLInputElement>("#all2");
      const quantity2 = document.querySelector<HTMLInputElement>("#quantity2");
      if (this.selectedIndex > 0) {
        all2!.disabled = false;
        if (!all2!.checked) {
          quantity2!.value = String(fungibles_in_worktop[this.value]);
        }
      } else {
        all2!.disabled = true;
        quantity2!.disabled = true;
        quantity2!.value = "";
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction2")!
    .addEventListener("click", function () {
      const account =
        document.querySelector<HTMLSelectElement>("#account2")!.value;

      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      if (document.querySelector<HTMLInputElement>("#worktop2")!.checked) {
        document.querySelector<HTMLTextAreaElement>(
          "#transaction_manifest"
        )!.value +=
          "CALL_METHOD\n" +
          '    Address("' +
          account +
          '")\n' +
          '    "deposit_batch"\n' +
          '    Expression("ENTIRE_WORKTOP")\n;\n';
        for (var f of Object.keys(fungibles_in_worktop)) {
          add_fungible_to_account(account, f, fungibles_in_worktop[f]);
        }
        remove_fungible_from_worktop("*", "*");
        for (var nf of non_fungibles_in_worktop) {
          add_non_fungible_to_account(account, nf);
        }
        remove_non_fungible_from_worktop("*");
      } else {
        const resource =
          document.querySelector<HTMLSelectElement>("#fungible2")!.value;
        if (resource.length > 0) {
          if (document.querySelector<HTMLInputElement>("#all2")!.checked) {
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "TAKE_ALL_FROM_WORKTOP\n" +
              '    Address("' +
              resource +
              '")\n' +
              '    Bucket("bucket' +
              bucket_number +
              '")\n;\n' +
              "CALL_METHOD\n" +
              '    Address("' +
              account +
              '")\n' +
              '    "deposit"\n' +
              '    Bucket("bucket' +
              bucket_number++ +
              '")\n;\n';
            add_fungible_to_account(
              account,
              resource,
              fungibles_in_worktop[resource]
            );
            remove_fungible_from_worktop(resource, "*");
          } else {
            const quantity =
              document.querySelector<HTMLInputElement>("#quantity2")!.value;
            if (!quantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
              document.querySelector<HTMLParagraphElement>("#warn")!.innerText =
                "invalid quantity!";
            } else {
              document.querySelector<HTMLInputElement>("#quantity2")!.value =
                "";
              document.querySelector<HTMLTextAreaElement>(
                "#transaction_manifest"
              )!.value +=
                "TAKE_FROM_WORKTOP\n" +
                '    Address("' +
                resource +
                '")\n' +
                '    Decimal("' +
                quantity +
                '")\n' +
                '    Bucket("bucket' +
                bucket_number +
                '")\n;\n' +
                "CALL_METHOD\n" +
                '    Address("' +
                account +
                '")\n' +
                '    "deposit"\n' +
                '    Bucket("bucket' +
                bucket_number++ +
                '")\n;\n';
              add_fungible_to_account(account, resource, parseFloat(quantity));
              remove_fungible_from_worktop(resource, quantity);
            }
          }
        }

        const non_fungible =
          document.querySelector<HTMLSelectElement>("#non_fungible2")!.value;
        if (non_fungible.length > 0) {
          const res = non_fungible.split(" ");
          if (res[1] == unknown_nft_id) {
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "TAKE_ALL_FROM_WORKTOP\n" +
              '    Address("' +
              res[0] +
              '")\n' +
              '    Bucket("bucket' +
              bucket_number +
              '")\n;\n';
          } else {
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "TAKE_NON_FUNGIBLES_FROM_WORKTOP\n" +
              '    Address("' +
              res[0] +
              '")\n' +
              "    Array<NonFungibleLocalId>(\n" +
              '        NonFungibleLocalId("' +
              res[1] +
              '")\n    )\n' +
              '    Bucket("bucket' +
              bucket_number +
              '")\n;\n';
          }
          document.querySelector<HTMLTextAreaElement>(
            "#transaction_manifest"
          )!.value +=
            "CALL_METHOD\n" +
            '    Address("' +
            account +
            '")\n' +
            '    "deposit"\n' +
            '    Bucket("bucket' +
            bucket_number++ +
            '")\n;\n';
          remove_non_fungible_from_worktop(non_fungible);
        }
      }
      document.querySelector<HTMLSelectElement>(
        "#fungible2"
      )!.selectedIndex = 0;
      document.querySelector<HTMLSelectElement>(
        "#non_fungible2"
      )!.selectedIndex = 0;
    });
</script>

<div id="div2">
  <div>
    account:
    <select id="account2" />
  </div>
  <div>
    entire worktop
    <input type="checkbox" id="worktop2" checked={true} />
  </div>
  <div>
    fungibles:
    <select id="fungible2" disabled={true}>
      <option />
    </select>
    quantity: <input type="text" id="quantity2" disabled={true} /> all
    <input type="checkbox" id="all2" checked={true} disabled={true} />
  </div>
  <div>
    non fungibles:
    <select id="non_fungible2" disabled={true}>
      <option />
    </select>
  </div>
  <div>
    <input type="button" value="add instructions" id="add_instruction2" />
  </div>
</div>
