sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/comp/sample/smarttable/mockserver/DemoMockServer"
], function (Controller, ODataModel, DemoMockServer) {
	"use strict";

	return Controller.extend("project1.SmartTable", {
		onInit: function () {
			this._oMockServer = new DemoMockServer();

			const oModel = new ODataModel(this._oMockServer.getServiceUrl(), {
				defaultCountMode: "Inline"
			});

			const oView = this.getView();
			oView.setModel(oModel);
		},
		onBeforeExport: function (oEvt) {
			const mExcelSettings = oEvt.getParameter("exportSettings");
			// GW export
			if (mExcelSettings.url) {
				return;
			}
			// For UI5 Client Export --> The settings contains sap.ui.export.SpreadSheet relevant settings that be used to modify the output of excel

			// Disable Worker as Mockserver is used in Demokit sample --> Do not use this for real applications!
			mExcelSettings.worker = false;
		},
		onExit: function () {
			this._oMockServer.destroy();
		},
		onDeletePress: function (oEvent) {
			const oSmartTable = this.byId("LineItemsSmartTable");
			if (!oSmartTable) {
				sap.m.MessageToast.show("SmartTable with ID 'smartTable' not found.");
				return;
			}
			const oTable = oSmartTable.getTable();
			const oModel = this.getView().getModel();
			const aSelectedIndices = oTable.getSelectedIndices();

			if (aSelectedIndices.length === 0) {
				sap.m.MessageToast.show("Please select at least one row to delete.");
				return;
			}

			const aContexts = aSelectedIndices.map(function (iIndex) {
				return oTable.getContextByIndex(iIndex);
			});

			// Xóa từng dòng được chọn từ SmartTable
			aContexts.forEach(function (oContext) {
				oModel.remove(oContext.getPath(), {
					success: function () {
						sap.m.MessageToast.show("Entry deleted successfully.");
					},
					error: function () {
						sap.m.MessageToast.show("Error deleting entry.");
					}
				});
			});
		},

	});
});
